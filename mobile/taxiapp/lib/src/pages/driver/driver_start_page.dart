import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'package:map_launcher/map_launcher.dart';

class DriverStartPage extends StatefulWidget {
  @override
  _DriverStartPageState createState() => _DriverStartPageState();
}

class _DriverStartPageState extends State<DriverStartPage> {
  final storage = FlutterSecureStorage();
  Map<String, dynamic>? _currentRide;
  bool _isLoading = true;
  bool _noRides = false;
  String? _pickupAddress;
  String? _dropoffAddress;
  bool _isRideStarted = false;

  @override
  void initState() {
    super.initState();
    _fetchCurrentRide();
  }

  Future<void> _fetchCurrentRide() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      setState(() {
        _isLoading = false;
        _noRides = true;
      });
      return;
    }

    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/driver/current'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      if (response.body.isEmpty) {
        setState(() {
          _currentRide = null;
          _isLoading = false;
          _noRides = true;
        });
      } else {
        final data = jsonDecode(response.body);
        if (data == null || data.isEmpty || data['status'] == 'COMPLETED') {
          setState(() {
            _currentRide = null;
            _isLoading = false;
            _noRides = true;
          });
        } else {
          setState(() {
            _currentRide = data;
            _isLoading = false;
            _isRideStarted = _currentRide!['status'] == 'STARTED';
            _noRides = false;
          });
          _fetchAddresses();
        }
      }
    } else {
      _showSnackBar('Error al obtener la información del viaje: ${response.reasonPhrase}', Colors.red);
      setState(() {
        _isLoading = false;
        _noRides = true;
      });
    }
  }

  Future<void> _fetchAddresses() async {
    if (_currentRide != null) {
      try {
        // Trata de convertir las coordenadas a una lista de double
        List<double> pickupCoords = _getCoords(_currentRide!['pickup_location']);
        List<double> dropoffCoords = _getCoords(_currentRide!['dropoff_location']);

        _pickupAddress = await _getAddressFromCoords(pickupCoords);
        _dropoffAddress = await _getAddressFromCoords(dropoffCoords);

        setState(() {});
      } catch (e) {
        _showSnackBar('Error al procesar las coordenadas: $e', Colors.red);
      }
    }
  }

  List<double> _getCoords(dynamic location) {
    if (location is String) {
      // Manejar el caso donde location es una cadena "lat,long"
      return location.split(',').map((e) => double.parse(e.trim())).toList();
    } else if (location is List) {
      // Manejar el caso donde location es una lista [lat, long]
      return List<double>.from(location);
    } else {
      throw Exception('Formato de coordenadas no soportado');
    }
  }

  Future<String> _getAddressFromCoords(List<double> coords) async {
    final latitude = coords[0];
    final longitude = coords[1];
    final apiKey = 'pk.eyJ1IjoiY29xdWl0b3BpbnRvIiwiYSI6ImNtM2MyczBkYzF1enIyaXB2czV6ZDR2NTUifQ.DAglF9R7BrCoATfWmCTQ7w';
    final url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/$longitude,$latitude.json?access_token=$apiKey';

    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['features'].isNotEmpty) {
        return data['features'][0]['place_name'];
      } else {
        return 'Dirección no disponible';
      }
    } else {
      return 'Dirección no disponible';
    }
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: TextStyle(color: Colors.white)),
        backgroundColor: color,
      ),
    );
  }

  Future<void> _startRide() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.post(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/${_currentRide!['id']}/start'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      setState(() {
        _isRideStarted = true;
        _currentRide!['status'] = 'STARTED';
      });
      _showSnackBar('Viaje iniciado', Colors.green);
    } else {
      _showSnackBar('Error al iniciar el viaje: ${response.reasonPhrase}', Colors.red);
    }
  }

  Future<void> _completeRide() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.post(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/${_currentRide!['id']}/complete'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      setState(() {
        _isRideStarted = false;
        _currentRide!['status'] = 'COMPLETED';
        _currentRide = null;
        _noRides = true;
      });
      _showSnackBar('Viaje completado', Colors.green);
    } else {
      _showSnackBar('Error al completar el viaje: ${response.reasonPhrase}', Colors.red);
    }
  }

  void _openGoogleMaps(String? coords) async {
    if (coords == null) {
      _showSnackBar('Coordenadas no disponibles', Colors.red);
      return;
    }

    final List<String> latLng = coords.split(',');
    if (latLng.length != 2) {
      _showSnackBar('Formato de coordenadas incorrecto', Colors.red);
      return;
    }

    final double latitude = double.parse(latLng[0].trim());
    final double longitude = double.parse(latLng[1].trim());

    final isMapAvailable = await MapLauncher.isMapAvailable(MapType.google);
    if (isMapAvailable == true) {
      await MapLauncher.showMarker(
        mapType: MapType.google,
        coords: Coords(latitude, longitude),
        title: "Ubicación",
      );
    } else {
      _showSnackBar('Google Maps no está disponible en este dispositivo', Colors.red);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bienvenido, conductor'),
        backgroundColor: const Color(0xFF1f2937),
        titleTextStyle: TextStyle(color: Colors.white, fontSize: 24, fontFamily: 'Roboto', fontWeight: FontWeight.bold),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _noRides
              ? Center(child: Text('No tienes viajes aceptados', style: TextStyle(fontSize: 18, color: Colors.white)))
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Container(
                    color: Color(0xFF030712), // Fondo del componente
                    padding: EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.directions_car, color: Colors.white), // Icono de viaje
                            SizedBox(width: 8),
                            Text(
                              'Viaje Actual',
                              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ],
                        ),
                        SizedBox(height: 20),
                        Text(
                          'Cliente: ${_currentRide!['client']['name']} ${_currentRide!['client']['lastname']}',
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                        Text(
                          'Email: ${_currentRide!['client']['email']}',
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                        Text(
                          'Teléfono: ${_currentRide!['client']['phone']}',
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                        SizedBox(height: 20),
                        Text(
                          'Recogida: $_pickupAddress',
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                        GestureDetector(
                          onTap: () => _openGoogleMaps(_currentRide!['pickup_location']),
                          child: Text(
                            'Ver en Google Maps',
                            style: TextStyle(fontSize: 18, color: Colors.blue, decoration: TextDecoration.underline),
                          ),
                        ),
                        Text(
                          'Destino: $_dropoffAddress',
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                        GestureDetector(
                          onTap: () => _openGoogleMaps(_currentRide!['dropoff_location']),
                          child: Text(
                            'Ver en Google Maps',
                            style: TextStyle(fontSize: 18, color: Colors.blue, decoration: TextDecoration.underline),
                          ),
                        ),
                        Text(
                          'Estado: ${_currentRide!['status']}',
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                        SizedBox(height: 20),
                        if (_isRideStarted)
                          ElevatedButton(
                            onPressed: _completeRide,
                            child: Text('Finalizar Viaje'),
                          )
                        else
                          ElevatedButton(
                            onPressed: _startRide,
                            child: Text('Iniciar Viaje'),
                          ),
                      ],
                    ),
                  ),
                ),
    );
  }
}