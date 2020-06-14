import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Searchbar } from 'react-native-paper';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from '@react-native-community/geolocation';
import Spinner from 'react-native-loading-spinner-overlay';
import MapboxGL from '@react-native-mapbox-gl/maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Constant from '../../utils/constant';
import { TouchableOpacity } from 'react-native-gesture-handler';
MapboxGL.setAccessToken(Constant.ACCESS_TOKEN);
const HomeScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [userPos, setUserPos] = useState({ place: '', coord: [2.35183, 48.85658] });
  const [centerCoordinate, setCenterCoordinate] = useState({ place: '', coord: [2.35183, 48.85658] });

  const [images, setImages] = useState();
  const [featureCollection, setFeatureCollection] = useState({
    "type": "FeatureCollection",
    "features": [
    ]
  });
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // User Position
      const bootstrapAsync = async (coords) => {
        console.log(userPos);
        // Getting Pictures from Firestore 
        firestore().collection('Pictures')
          .get()
          .then(querySnapshot => {
            let items = [];
            querySnapshot.forEach(documentSnapshot => {
              items.push(documentSnapshot.data());
            });
            updateMarkers(items);
            setLoading(false);
          });
      };
      setLoading(true);
      Geolocation.getCurrentPosition(info => {
        if (info.coords != undefined) {
          setUserPos({
            place: '',
            coord: [info.coords.longitude, info.coords.latitude]
          });
          setCenterCoordinate({
            place: '',
            coord: [info.coords.longitude, info.coords.latitude]
          });
          // Get User Region
          let baseURL = Constant.MAPBOX_BASEURL;
          let searchurl = baseURL + info.coords.longitude + ',' + info.coords.latitude + '.json?types=region&access_token=' + Constant.ACCESS_TOKEN;
          axios.get(searchurl)
            .then(response => {
              let locationData = response.data.features[0];
              //console.log(locationData.place_name);
              setUserPos({
                coord: [info.coords.longitude, info.coords.latitude],
                place: locationData.place_name
              });
              saveCoordinateData({
                coord: [info.coords.longitude, info.coords.latitude],
                place: locationData.place_name
              });
              bootstrapAsync(info.coords)
            })
            .catch(error => {
              setLoading(false);
            });
        }
        else {
          setLoading(false);
        }
      }
      );

    });
    return unsubscribe;

  }, [navigation]);

  const updateMarkers = (items) => {
    const markers = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const coordinate = item.coord;
      const title = item.place;
      const picture = item.picture;
      markers.push(
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": coordinate
          },
          "properties": {
            markerImage: picture,
          }
        }
      );
    }
    setFeatureCollection({
      "type": "FeatureCollection",
      "features": markers
    })
  }
  const onPlacePressed = (item) => {
    handleSearch('');
    setTimeout(() => {
      saveCoordinateData({
        place: item.place_name,
        coord: item.center
      });
    }, 500);

  }
  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onPlacePressed(item)}
      >
        <View style={styles.item}>
          <MaterialCommunityIcons
            name="map-marker"
            size={30}
          />
          <View style={{ paddingLeft: 10 }}>
            <Text>
              {item.text}
            </Text>
            <Text style={{ color: '#888888' }}>
              {item.place_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  const onDidFinishLoadingMap = () => {
    console.log("Map loaded.......");
  }
  const saveCoordinateData = (item) => {
    AsyncStorage.setItem('POS_DATA', JSON.stringify(item));
    setCenterCoordinate(item);
  }
  const onNavigationPressed = () => {
    console.log(userPos);
    saveCoordinateData(userPos);
  }
  const handleSearch = (query) => {
    setQuery(query);
    if (query.length >= 1) {
      let baseURL = Constant.MAPBOX_BASEURL;
      let searchurl = baseURL + query + '.json?types=region&access_token=' + Constant.ACCESS_TOKEN;
      axios.get(searchurl)
        .then(response => {
          //          console.log(response.data.features);
          setData(response.data.features)
        })
        .catch(error => {
          //          console.log(error);
          setData([])
        });
    }
    else {
      setData([]);
    }
  }
  return (
    <>
      <View style={styles.container}>
        <Spinner
          visible={loading} size="large" style={styles.spinnerStyle} />
        <Searchbar
          placeholder="Search"
          onChangeText={(query) => handleSearch(query)}
          value={query}
          style={styles.searchbar}
        />
        {data.length > 0 ?
          <View
            style={styles.listContainer}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={renderSeparator}
              renderItem={data ? renderItem : null} />
          </View>
          : null
        }
        <MapboxGL.MapView
          style={styles.mapStyle}
          onDidFinishLoadingMap={onDidFinishLoadingMap}
          showUserLocation={true}>
          <MapboxGL.Camera
            zoomLevel={2}
            animationMode={'flyTo'}
            centerCoordinate={centerCoordinate.coord} />
          <MapboxGL.UserLocation />
          <MapboxGL.Images
            nativeAssetImages={['pin']}
            images={images}
            onImageMissing={url => {
              //console.log("on image missing2", url);
              setImages({
                ...images,
                [url]: {uri: url},
              });
              //console.info(images);
            }}
          />
          <MapboxGL.ShapeSource
            id="shapeSource"
            shape={featureCollection}>
            <MapboxGL.SymbolLayer 
              id="symbolLayer"
              style={{
                iconImage: ['get', 'markerImage'],
                iconSize: 0.03,
                iconAllowOverlap: true,
            }} />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>

        <View
          style={styles.actionButton}>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => onNavigationPressed()}>
            <View>
              <MaterialCommunityIcons name="navigation" style={styles.actionButtonIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  spinnerStyle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchbar: {
    margin: 4,
  },
  listContainer: {
    height: '100%',
  },
  item: {
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mapStyle: {
    flex: 1
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2667c9',
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  annotationContainer: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 23,
    borderWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.45)',
    overflow: 'hidden',
  },
});

export default HomeScreen;