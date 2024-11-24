import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

class MapScreen extends StatefulWidget {
  final Function(LatLng, LatLng) onLocationSelected;

  MapScreen({required this.onLocationSelected});

  @override
  MapScreenState createState() => MapScreenState();
}

class MapScreenState extends State<MapScreen> {
  LatLng? myPosition;
  LatLng? _pickupPosition;
  LatLng? _dropoffPosition;
  final MapController _mapController = MapController();

  @override
  void initState() {
    super.initState();
    getCurrentLocation();
  }

  void getCurrentLocation() async {
    Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);
    if (mounted) {
      setState(() {
        myPosition = LatLng(position.latitude, position.longitude);
        WidgetsBinding.instance.addPostFrameCallback((_) {
          _mapController.move(myPosition!, 12.0);
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Seleccionar Ubicaciones'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
      ),
      body: myPosition == null
          ? const Center(child: CircularProgressIndicator())
          : FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                onTap: (tapPosition, point) {
                  setState(() {
                    if (_pickupPosition == null) {
                      _pickupPosition = point;
                    } else if (_dropoffPosition == null) {
                      _dropoffPosition = point;
                      // Una vez seleccionadas ambas ubicaciones, podemos volver
                      widget.onLocationSelected(_pickupPosition!, _dropoffPosition!);
                      Navigator.pop(context);
                    }
                  });
                },
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY29xdWl0b3BpbnRvIiwiYSI6ImNtM2MyczBkYzF1enIyaXB2czV6ZDR2NTUifQ.DAglF9R7BrCoATfWmCTQ7w',
                  additionalOptions: {
                    'accessToken': 'pk.eyJ1IjoiY29xdWl0b3BpbnRvIiwiYSI6ImNtM2MyczBkYzF1enIyaXB2czV6ZDR2NTUifQ.DAglF9R7BrCoATfWmCTQ7w',
                    'id': 'mapbox.streets',
                  },
                ),
                MarkerLayer(
                  markers: [
                    if (_pickupPosition != null)
                      Marker(
                        width: 80.0,
                        height: 80.0,
                        point: _pickupPosition!,
                        child: const Icon(Icons.location_on, color: Colors.red, size: 40),
                      ),
                    if (_dropoffPosition != null)
                      Marker(
                        width: 80.0,
                        height: 80.0,
                        point: _dropoffPosition!,
                        child: const Icon(Icons.location_on, color: Colors.blue, size: 40),
                      ),
                  ],
                ),
              ],
            ),
    );
  }
}
