import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'track_trip_page.dart';

class UserTripHistoryPage extends StatefulWidget {
  @override
  _UserTripHistoryPageState createState() => _UserTripHistoryPageState();
}

class _UserTripHistoryPageState extends State<UserTripHistoryPage> {
  final storage = FlutterSecureStorage();
  List<dynamic> _trips = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchTripHistory();
  }

  Future<void> _fetchTripHistory() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      _showSnackBar('Token no encontrado', Colors.red);
      return;
    }

    final response = await http.get(
      Uri.parse('http://192.168.56.1:8080/api/v1/rides/my'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        _trips = data['content'].where((trip) => trip['status'] == 'COMPLETED' || trip['status'] == 'CANCELLED').toList();
        _isLoading = false;
      });
    } else {
      _showSnackBar('Error al obtener el historial de viajes: ${response.reasonPhrase}', Colors.red);
      setState(() {
        _isLoading = false;
      });
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
      MaterialPageRoute(
        builder: (context) => TrackTripPage(trip: trip),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Historial de Viajes'),
        backgroundColor: const Color(0xFF1f2937),
        titleTextStyle: TextStyle(color: Colors.white, fontSize: 24, fontFamily: 'Roboto', fontWeight: FontWeight.bold),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _trips.isEmpty
              ? Center(child: Text('No tienes viajes en el historial', style: TextStyle(fontSize: 18, color: Colors.white)))
              : ListView.builder(
                  itemCount: _trips.length,
                  itemBuilder: (context, index) {
                    final trip = _trips[index];
                    return Card(
                      color: Color(0xFF1f2937),
                      child: ListTile(
                        title: Text(
                          'Viaje ${trip['id']}',
                          style: TextStyle(color: Colors.white),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Recogida: ${trip['pickup_location']}',
                              style: TextStyle(color: Colors.white),
                            ),
                            Text(
                              'Destino: ${trip['dropoff_location']}',
                              style: TextStyle(color: Colors.white),
                            ),
                            Text(
                              'Estado: ${trip['status']}',
                              style: TextStyle(color: trip['status'] == 'COMPLETED' ? Colors.green : Colors.red),
                            ),
                            if (trip['status'] == 'COMPLETED')
                              ElevatedButton(
                                onPressed: () => _navigateToTrackTripPage(context, trip),
                                child: Text('Calificar Viaje'),
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