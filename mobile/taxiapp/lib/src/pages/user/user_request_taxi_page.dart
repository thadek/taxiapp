/*
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:latlong2/latlong.dart';
import 'dart:convert';
import 'package:taxiapp/screens/map_screen.dart'; // Asegúrate de que la ruta de importación sea correcta

class UserRequestTaxiPage extends StatefulWidget {
  @override
  _UserRequestTaxiPageState createState() => _UserRequestTaxiPageState();
}

class _UserRequestTaxiPageState extends State<UserRequestTaxiPage> {
  final storage = FlutterSecureStorage();

  LatLng? _pickupLocation;
  LatLng? _dropoffLocation;

  void _openMapScreen() async {
    // Navega a MapScreen y espera a que se seleccionen las ubicaciones
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MapScreen(
          onLocationSelected: (pickup, dropoff) {
            setState(() {
              _pickupLocation = pickup;
              _dropoffLocation = dropoff;
            });
            // No es necesario cerrar el MapScreen aquí, se cierra dentro de MapScreen
          },
        ),
      ),
    );
  }

  void _requestRide() async {
    if (_pickupLocation == null || _dropoffLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Por favor, selecciona las ubicaciones primero.')),
      );
      return;
    }

    try {
      // Recuperar el token del almacenamiento seguro
      String? token = await storage.read(key: 'auth_token');

      if (token == null) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Token no encontrado')));
        return;
      }

      // Formatear las coordenadas
      String pickupLocation = '${_pickupLocation!.latitude.toStringAsFixed(6)},${_pickupLocation!.longitude.toStringAsFixed(6)}';
      String dropoffLocation = '${_dropoffLocation!.latitude.toStringAsFixed(6)},${_dropoffLocation!.longitude.toStringAsFixed(6)}';

      print('Pickup Location: $pickupLocation');
      
      print('Dropoff Location: $dropoffLocation');
      
      final response = await http.post(
        Uri.parse('http://192.168.56.1:8080/api/v1/rides/request'), // Ajusta la URL según corresponda
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'pickupLocation': pickupLocation,
          'dropoffLocation': dropoffLocation,
          'isBooked': false,
        }),
      );

      if (response.statusCode == 200) {
        // Solicitud exitosa
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Taxi solicitado con éxito')));
      } else {
        // Error en la solicitud
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al solicitar taxi: ${response.reasonPhrase}')),
        );
      }
    } catch (e) {
      // Manejo de errores
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Solicitar Taxi'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: _openMapScreen,
              child: Text('Seleccionar ubicaciones en el mapa'),
            ),
            SizedBox(height: 10),
            if (_pickupLocation != null && _dropoffLocation != null)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Ubicación de recogida: ${_pickupLocation!.latitude.toStringAsFixed(6)}, ${_pickupLocation!.longitude.toStringAsFixed(6)}',
                  ),
                  Text(
                    'Ubicación de destino: ${_dropoffLocation!.latitude.toStringAsFixed(6)}, ${_dropoffLocation!.longitude.toStringAsFixed(6)}',
                  ),
                ],
              ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _requestRide,
              child: Text('Solicitar Taxi'),
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                textStyle: TextStyle(fontSize: 20),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
-------------------------------------
*/

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:latlong2/latlong.dart';
import 'dart:convert';
import 'package:taxiapp/screens/map_screen.dart'; // Asegúrate de que la ruta de importación sea correcta

// Clase para manejar la búsqueda de direcciones con Mapbox
class MapboxSearchService {
  final String accessToken;

  MapboxSearchService(this.accessToken);

  Future<List<MapBoxPlace>> searchPlaces(String query) async {
    final url = Uri.parse(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/$query.json?access_token=$accessToken&limit=5&language=es&country=AR');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final features = data['features'] as List;
      return features.map((feature) => MapBoxPlace.fromJson(feature)).toList();
    } else {
      throw Exception('Failed to load places');
    }
  }
}

class MapBoxPlace {
  final String placeName;
  final LatLng coordinates;

  MapBoxPlace({required this.placeName, required this.coordinates});

  factory MapBoxPlace.fromJson(Map<String, dynamic> json) {
    final coords = json['geometry']['coordinates'];
    return MapBoxPlace(
      placeName: json['place_name'],
      coordinates: LatLng(coords[1], coords[0]),
    );
  }
}

class UserRequestTaxiPage extends StatefulWidget {
  @override
  _UserRequestTaxiPageState createState() => _UserRequestTaxiPageState();
}

class _UserRequestTaxiPageState extends State<UserRequestTaxiPage> {
  final storage = FlutterSecureStorage();
  final TextEditingController _pickupController = TextEditingController();
  final TextEditingController _dropoffController = TextEditingController();
  final MapboxSearchService _searchService = MapboxSearchService('pk.eyJ1IjoiY29xdWl0b3BpbnRvIiwiYSI6ImNtM2MyczBkYzF1enIyaXB2czV6ZDR2NTUifQ.DAglF9R7BrCoATfWmCTQ7w');

  LatLng? _pickupLocation;
  LatLng? _dropoffLocation;
  List<MapBoxPlace>? _places;
  bool _isPickupSearch = true;

  void _openMapScreen() async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MapScreen(
          onLocationSelected: (pickup, dropoff) {
            setState(() {
              _pickupLocation = pickup;
              _dropoffLocation = dropoff;
            });
          },
        ),
      ),
    );
  }

  void _searchLocation(String query) async {
    if (query.isNotEmpty) {
      var places = await _searchService.searchPlaces(query);
      setState(() {
        _places = places;
      });
    } else {
      setState(() {
        _places = null;
      });
    }
  }

  void _requestRide() async {
    if (_pickupLocation == null || _dropoffLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Por favor, selecciona las ubicaciones primero.')),
      );
      return;
    }

    try {
      String? token = await storage.read(key: 'auth_token');

      if (token == null) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Token no encontrado')));
        return;
      }

      String pickupLocation = '${_pickupLocation!.latitude.toStringAsFixed(6)},${_pickupLocation!.longitude.toStringAsFixed(6)}';
      String dropoffLocation = '${_dropoffLocation!.latitude.toStringAsFixed(6)},${_dropoffLocation!.longitude.toStringAsFixed(6)}';

      final response = await http.post(
        Uri.parse('http://192.168.56.1:8080/api/v1/rides/request'), // Ajusta la URL según corresponda
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'pickupLocation': pickupLocation,
          'dropoffLocation': dropoffLocation,
          'isBooked': false,
        }),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Taxi solicitado con éxito')));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al solicitar taxi: ${response.reasonPhrase}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  void _onLocationSelect(MapBoxPlace place) {
    setState(() {
      if (_isPickupSearch) {
        _pickupLocation = place.coordinates;
        _pickupController.text = place.placeName;
      } else {
        _dropoffLocation = place.coordinates;
        _dropoffController.text = place.placeName;
      }
      _places = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Solicitar Taxi'),
        backgroundColor: Colors.blue.shade900,
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Buscar Lugar de Recogida:', style: TextStyle(fontSize: 16)),
                TextField(
                  controller: _pickupController,
                  decoration: InputDecoration(hintText: 'Buscar dirección o lugar...'),
                  onChanged: (value) {
                    _isPickupSearch = true;
                    _searchLocation(value);
                  },
                ),
                SizedBox(height: 10),
                Text('Buscar Lugar de Destino:', style: TextStyle(fontSize: 16)),
                TextField(
                  controller: _dropoffController,
                  decoration: InputDecoration(hintText: 'Buscar dirección o lugar...'),
                  onChanged: (value) {
                    _isPickupSearch = false;
                    _searchLocation(value);
                  },
                ),
                SizedBox(height: 10),
                ElevatedButton(
                  onPressed: _openMapScreen,
                  child: Text('Seleccionar ubicaciones en el mapa'),
                ),
                SizedBox(height: 10),
                if (_pickupLocation != null && _dropoffLocation != null)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Ubicación de recogida: ${_pickupLocation!.latitude.toStringAsFixed(6)}, ${_pickupLocation!.longitude.toStringAsFixed(6)}',
                      ),
                      Text(
                        'Ubicación de destino: ${_dropoffLocation!.latitude.toStringAsFixed(6)}, ${_dropoffLocation!.longitude.toStringAsFixed(6)}',
                      ),
                    ],
                  ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _requestRide,
                  child: Text('Solicitar Taxi'),
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                    textStyle: TextStyle(fontSize: 20),
                  ),
                ),
              ],
            ),
          ),
          if (_places != null)
            Positioned(
              top: 100, // Ajusta esta posición según sea necesario
              left: 16,
              right: 16,
              child: Material(
                elevation: 4.0,
                borderRadius: BorderRadius.circular(8.0),
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: _places!.length,
                  itemBuilder: (context, index) {
                    var place = _places![index];
                    return ListTile(
                      title: Text(place.placeName),
                      onTap: () => _onLocationSelect(place),
                    );
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }
}