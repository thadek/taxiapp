import 'package:flutter/material.dart';
import 'package:getwidget/getwidget.dart';
import 'package:timelines/timelines.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TrackTripPage extends StatefulWidget {
  final Map<String, dynamic> trip;

  TrackTripPage({required this.trip});

  @override
  _TrackTripPageState createState() => _TrackTripPageState();
}

class _TrackTripPageState extends State<TrackTripPage> {
  final Map<String, String> statuses = {
    'PENDING': 'Pendiente',
    'DRIVER_ASSIGNED': 'Conductor Asignado',
    'ACCEPTED': 'Aceptado',
    'STARTED': 'En Proceso',
    'COMPLETED': 'Completado'
  };

  final TextEditingController _ratingController = TextEditingController();
  double _userRating = 5.0;
  final storage = FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    _ratingController.text = '5';
  }

  int getStatusIndex(String status) {
    return statuses.keys.toList().indexOf(status);
  }

  Future<void> _submitRating() async {
    String? token = await storage.read(key: 'auth_token');
    if (token == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Token no encontrado', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Asegurarse de que el rating es un entero
    int rating = int.parse(_ratingController.text);

    try {
      final response = await http.post(
        Uri.parse('http://192.168.56.1:8080/api/v1/rides/${widget.trip['id']}/rate?rating=$rating'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Calificación enviada con éxito', style: TextStyle(color: Colors.white)),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al enviar la calificación: ${response.reasonPhrase}', style: TextStyle(color: Colors.white)),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Ocurrió un error: $e', style: TextStyle(color: Colors.white)),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Seguimiento del Viaje'),
        backgroundColor: const Color(0xFF1f2937),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Viaje ${widget.trip['id']}',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            SizedBox(height: 20),
            Text('Recogida: ${widget.trip['pickup_location']}', style: TextStyle(color: Colors.white)),
            Text('Destino: ${widget.trip['dropoff_location']}', style: TextStyle(color: Colors.white)),
            SizedBox(height: 20),
            Expanded(
              child: Timeline.tileBuilder(
                builder: TimelineTileBuilder.connectedFromStyle(
                  connectionDirection: ConnectionDirection.before,
                  connectorStyleBuilder: (context, index) => ConnectorStyle.solidLine,
                  indicatorStyleBuilder: (context, index) => IndicatorStyle.dot,
                  itemCount: statuses.length,
                  contentsBuilder: (context, index) => Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Text(
                      statuses.values.elementAt(index),
                      style: TextStyle(
                        color: index <= getStatusIndex(widget.trip['status']) ? Colors.white : Colors.grey,
                        fontWeight: index <= getStatusIndex(widget.trip['status']) ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            if (widget.trip['status'] == 'COMPLETED')
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Califique su viaje:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                  GFRating(
                    value: _userRating,
                    onChanged: (value) {
                      setState(() {
                        _userRating = value;
                        _ratingController.text = _userRating.toStringAsFixed(0); // Convertir a entero
                      });
                    },
                    showTextForm: true,
                    controller: _ratingController,
                    allowHalfRating: false, // No permite calificaciones intermedias
                    suffixIcon: GFButton(
                      type: GFButtonType.transparent,
                      onPressed: _submitRating,
                      child: const Text('Calificar'),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
      backgroundColor: const Color(0xFF1f2937), // Fondo del scaffold
    );
  }
}
