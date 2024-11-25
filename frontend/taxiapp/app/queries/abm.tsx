import { report } from "process";

const fetchWithAuth = async (url: string, token: string, options: RequestInit = {}) => {
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });
  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return null; // O devuelve un valor adecuado si no es JSON
  } else {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
    
};

/**
 * Obtener todos los usuarios
 * @returns 
 */
const getUsers = async (token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, token);
};

/**
 * Obtener un usuario específico
 * @param userId
 * @returns 
 */
const getUser = async (userId: string, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, token);
};

/**
 * Crear un nuevo usuario
 * @param newUser
 * @returns 
 */
const createUser = async (newUser: any, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, token, {
        method: 'POST',
        body: JSON.stringify(newUser),
    });
};

/**
 * Actualizar un usuario
 * @param userId
 * @param userToUpdate
 * @returns 
 */
const updateUser = async (userId: string, userToUpdate: any, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, token, {
        method: 'PATCH',
        body: JSON.stringify(userToUpdate),
    });
};

const userAssignRole = async (userId: string, roleId: string, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/roles/${roleId}`, token, {
        method: 'POST',
    });
};

/**
 * Eliminar un usuario
 * @param userId
 * @returns 
 */
const deleteUser = async (userId: string, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`, token, {
        method: 'DELETE',
    });
};

/**
 * Obtener todos los conductores
 * @returns 
 */
const getDrivers = async (token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`, token);
};

/**
 * Crear un nuevo conductor
 * @param newDriver
 * @returns 
 */
const createDriver = async (newDriver: any, token: string) => {
    console.log(newDriver);
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers`, token, {
        method: 'POST',
        body: JSON.stringify(newDriver),
    });
};

/**
 * Actualizar un conductor
 * @param driverId
 * @param driverToUpdate
 * @returns 
 */
const updateDriver = async (driverId: string, driverToUpdate: any, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}`, token, {
        method: 'PATCH',
        body: JSON.stringify(driverToUpdate),
    });
};

/**
 * Eliminar un conductor
 * @param driverId
 * @returns 
 */
const deleteDriver = async (driverId: string, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}`, token, {
        method: 'DELETE',
    });
};

/**
 * Obtener todos los vehículos
 * @returns 
 */
const getVehicles = async (token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles`, token);
};

/**
 * Crear un nuevo vehículo
 * @param newVehicle
 * @returns 
 */
const createVehicle = async (newVehicle: any, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles`, token, {
        method: 'POST',
        body: JSON.stringify(newVehicle),
    });
};

/**
 * Actualizar un vehículo
 * @param vehicleId
 * @param vehicleToUpdate
 * @returns 
 */
const updateVehicle = async (vehicleId: number, vehicleToUpdate: any, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}`, token, {
        method: 'PATCH',
        body: JSON.stringify(vehicleToUpdate),
    });
};

const vehicleDriverAssign = async (vehicleId: number, driverId: string, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}/driver/${driverId}`, token, {
        method: 'PATCH',
    });
};

/**
 * Eliminar un vehículo
 * @param vehicleId
 * @returns 
 */
const deleteVehicle = async (vehicleId: number, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vehicles/${vehicleId}`, token, {
        method: 'DELETE',
    });
};

/**
 * Obtener todos los roles
 * @returns 
 */
const getRoles = async (token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`, token);
};

/**
 * Crear un nuevo rol
 * @param newRole
 * @returns 
 */
const createRole = async (newRole: any, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`, token, {
        method: 'POST',
        body: JSON.stringify(newRole),
    });
};

/**
 * Actualizar un rol
 * @param roleId
 * @param roleToUpdate
 * @returns 
 */
const updateRole = async (roleId: string, roleToUpdate: any, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles/${roleId}`, token, {
        method: 'PATCH',
        body: JSON.stringify(roleToUpdate),
    });
};

/**
 * Eliminar un rol
 * @param roleId
 * @returns 
 */
const deleteRole = async (roleId: string, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles/${roleId}`, token, {
        method: 'DELETE',
    });
};

/**
 * Obtener todos los reportes
 * @returns
 */
const getReports = async (token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports`, token);
};

/**
 * Obtener todos los reportes con el id del viaje
 * @param reportId
 * @returns
 */
const getReportsWithRideId = async (token: string) => {
    // Obtener todos los reportes
    const reportsResponse = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports`, token);
    const reports = reportsResponse.content || [];
  
    // Obtener todos los viajes
    const ridesResponse = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides`, token);
    const rides = ridesResponse.content || [];
  
    // Asocia los rideId de los viajes a los reportes
    const reportsWithRideId = reports.map((report: any) => {
      const ride = rides.find((ride: any) => ride.report && ride.report.id === report.id);
      return { ...report, rideId: ride ? ride.id : null };
    });
  
    return {
      data: reportsWithRideId,
      totalPages: reportsResponse.totalPages || 1,
    };
  };

/**
 * Obtener un reporte específico según el id del viaje
 * @param reportId
 * @returns
 */
const getReportByRideId = async (rideId: string, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/ride/${rideId}`, token);
}

/**
 * Crear un nuevo reporte
 * @param newReport
 * @returns 
 */
const createReport = async (newReport: any, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports`, token, {
        method: 'POST',
        body: JSON.stringify(newReport),
    });
};

/**
 * Eliminar un reporte
 * @param reportId
 * @returns 
 */
const deleteReport = async (reportId: string, token: string) => {
    return fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/${reportId}`, token, {
        method: 'DELETE',
    });
}

/**
 * Obtener todos los viajes
 * @returns
 */
const getRides = async (token: string, page: number = 0, size: number = 8) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides?page=${page}&size=${size}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch rides');
    }
    return response.json();
  };

export { getUsers, getUser, createUser, updateUser, userAssignRole, deleteUser, getDrivers, createDriver, updateDriver, deleteDriver, getVehicles, createVehicle, updateVehicle, vehicleDriverAssign, deleteVehicle, getRoles, createRole, updateRole, deleteRole, getReports, getReportsWithRideId, createReport, getReportByRideId, deleteReport, getRides };