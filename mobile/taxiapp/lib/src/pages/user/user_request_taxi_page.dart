import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:latlong2/latlong.dart';
import 'dart:convert';
import 'package:taxiapp/screens/map_screen.dart'; // Asegúrate de que la ruta de importación sea correcta
import 'package:intl/intl.dart'; // Para formatear la fecha y hora

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
  bool _isScheduled = false;
  DateTime? _scheduledDateTime;

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

      Map<String, dynamic> requestBody = {
        'pickupLocation': pickupLocation,
        'dropoffLocation': dropoffLocation,
        'isBooked': _isScheduled,
      };

      if (_isScheduled && _scheduledDateTime != null) {
        requestBody['rideStart'] = _scheduledDateTime!.toIso8601String();
      }

      final response = await http.post(
        Uri.parse('http://192.168.56.1:8080/api/v1/rides/request'), // Ajusta la URL según corresponda
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(requestBody),
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

  Future<void> _selectDateTime(BuildContext context) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2101),
    );
    if (pickedDate != null) {
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.now(),
      );
      if (pickedTime != null) {
        setState(() {
          _scheduledDateTime = DateTime(
            pickedDate.year,
            pickedDate.month,
            pickedDate.day,
            pickedTime.hour,
            pickedTime.minute,
          );
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Solicitar Taxi'),
        backgroundColor: const Color(0xFF1f2937),
        titleTextStyle: TextStyle(color: Colors.white, fontSize: 24, fontFamily: 'Roboro', fontWeight: FontWeight.bold),
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Buscar Lugar de Recogida:', style: TextStyle(fontSize: 16, color: Colors.white)),
                TextField(
                  controller: _pickupController,
                  decoration: InputDecoration(hintText: 'Buscar dirección o lugar...', hintStyle: TextStyle(color: Colors.grey)),
                  onChanged: (value) {
                    _isPickupSearch = true;
                    _searchLocation(value);
                  },
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
                SizedBox(height: 10),
                Text('Buscar Lugar de Destino:', style: TextStyle(fontSize: 16, color: Colors.white)),
                TextField(
                  controller: _dropoffController,
                  decoration: InputDecoration(hintText: 'Buscar dirección o lugar...', hintStyle: TextStyle(color: Colors.grey)),
                  onChanged: (value) {
                    _isPickupSearch = false;
                    _searchLocation(value);
                  },
                  style: TextStyle(fontSize: 16, color: Colors.white),
                ),
                SizedBox(height: 10),
                Row(
                  children: [
                    Text('Programar viaje:', style: TextStyle(fontSize: 16, color: Colors.white)),
                    Switch(
                      value: _isScheduled,
                      onChanged: (value) {
                        setState(() {
                          _isScheduled = value;
                        });
                      },
                    ),
                  ],
                ),
                if (_isScheduled)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Seleccionar fecha y hora:', style: TextStyle(fontSize: 16, color: Colors.white)),
                      ElevatedButton(
                        onPressed: () => _selectDateTime(context),
                        child: Text(_scheduledDateTime == null
                            ? 'Seleccionar fecha y hora'
                            : DateFormat('yyyy-MM-dd – kk:mm').format(_scheduledDateTime!)),
                      ),
                    ],
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
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                    textStyle: TextStyle(fontSize: 20),
                  ),
                  child: Text('Solicitar Taxi'),
                ),
              ],
            ),
          ),
          if (_places != null)
            Positioned(
              top: _isPickupSearch ? 150 : 250, // Ajusta esta posición según sea necesario
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
                      title: Text(place.placeName, style: TextStyle(color: Colors.black)), // Color del texto de la lista
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