import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'track_trip_page.dart';

class UserCurrentTripPage extends StatefulWidget {
  @override
  _UserCurrentTripPageState createState() => _UserCurrentTripPageState();
}

class _UserCurrentTripPageState extends State<UserCurrentTripPage> {
  final storage = FlutterSecureStorage();
  List<dynamic> _trips = [];
  bool _isLoading = true;
  Map<String, dynamic>? _driverInfo;
  String? _currentRideId;

  @override
  void initState() {
    super.initState();
    _fetchCurrentTrips();
  }

  Future<void> _fetchCurrentTrips() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/my/active'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        // Filtrar y ordenar los viajes por orden de pedido
        _trips = (data['content'] as List)
            .where((trip) => trip['status'] != 'CANCELLED')
            .toList();
        _isLoading = false;
      });
    } else {
      _showSnackBar('Error al obtener los viajes: ${response.reasonPhrase}', Colors.red);
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _fetchDriverInfo(String rideId) async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/$rideId/driver'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _driverInfo = data;
        _currentRideId = rideId;
      });
    } else {
      _showSnackBar('Error al obtener la información del conductor: ${response.reasonPhrase}', Colors.red);
    }
  }

  Future<void> _cancelRide(String rideId) async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.post(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/$rideId/client-cancel'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      _showSnackBar('Viaje cancelado con éxito', Colors.green);
      _fetchCurrentTrips(); // Actualizar la lista de viajes
    } else {
      _showSnackBar('Error al cancelar el viaje: ${response.reasonPhrase}', Colors.red);
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

  void _navigateToTrackTripPage(BuildContext context, Map<String, dynamic> trip) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => TrackTripPage(trip: trip)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Viaje Actual'),
        backgroundColor: const Color(0xFF1f2937),
        titleTextStyle: TextStyle(color: Colors.white, fontSize: 24, fontFamily: 'Roboto', fontWeight: FontWeight.bold),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _trips.isEmpty
              ? Center(child: Text('No tienes viajes activos', style: TextStyle(fontSize: 18, color: Colors.white)))
              : ListView.builder(
                  itemCount: _trips.length,
                  itemBuilder: (context, index) {
                    final trip = _trips[index];
                    return Card(
                      color: Color(0xFF1f2937),
                      margin: EdgeInsets.symmetric(vertical: 10, horizontal: 15),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Viaje ${index + 1}',
                              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 10),
                            Text(
                              'Recogida: ${trip['pickup_location']}',
                              style: TextStyle(color: Colors.white),
                            ),
                            Text(
                              'Destino: ${trip['dropoff_location']}',
                              style: TextStyle(color: Colors.white),
                            ),
                            if (trip['status'] == 'PENDING')
                              ElevatedButton(
                                onPressed: () => _cancelRide(trip['id']),
                                child: Text('Cancelar Viaje'),
                              ),
                            if (trip['vehicle'] != null && trip['vehicle']['driver'] != null)
                              Padding(
                                padding: const EdgeInsets.only(top: 10),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Información del Conductor:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                    Text('Nombre: ${trip['vehicle']['driver']['name']} ${trip['vehicle']['driver']['lastname']}', style: TextStyle(color: Colors.white)),
                                    Text('Email: ${trip['vehicle']['driver']['email']}', style: TextStyle(color: Colors.white)),
                                    Text('Teléfono: ${trip['vehicle']['driver']['phone']}', style: TextStyle(color: Colors.white)),
                                    Text('Vehículo: ${trip['vehicle']['brand']} ${trip['vehicle']['model']}', style: TextStyle(color: Colors.white)),
                                    Text('Placa: ${trip['vehicle']['licensePlate']}', style: TextStyle(color: Colors.white)),
                                    Text('Color: ${trip['vehicle']['color']}', style: TextStyle(color: Colors.white)),
                                  ],
                                ),
                              ),
                            SizedBox(height: 10),
                            ElevatedButton(
                              onPressed: () => _navigateToTrackTripPage(context, trip),
                              child: Text('Seguir Viaje'),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
