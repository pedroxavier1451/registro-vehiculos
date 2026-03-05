import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';

export interface VehicleRegistration {
  // Datos personales
  nombreCompleto: string;
  nombreGrupo: string;
  documentoIdentificacion: string;
  telefono: string;
  email: string;
  
  // Datos del vehículo
  tematica: string;
  tipoVehiculo: string;
  placa: string;
  
  // Metadatos
  fechaRegistro: any;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: any;

  constructor() {
    // Inicializar Firebase
    const app = initializeApp(environment.firebase);
    this.db = getFirestore(app);
  }

  // Verificar si existe un documento con la cédula
  async verificarDocumentoDuplicado(documento: string): Promise<boolean> {
    try {
      const vehiculosRef = collection(this.db, 'vehiculos');
      const q = query(vehiculosRef, where('documentoIdentificacion', '==', documento));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error verificando documento duplicado: ', error);
      throw error;
    }
  }

  // Verificar si existe un documento con el email
  async verificarEmailDuplicado(email: string): Promise<boolean> {
    try {
      const vehiculosRef = collection(this.db, 'vehiculos');
      const q = query(vehiculosRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error verificando email duplicado: ', error);
      throw error;
    }
  }

  async registrarVehiculo(data: any): Promise<string> {
    try {
      // Preparar los datos para Firebase
      const vehicleData: VehicleRegistration = {
        nombreCompleto: data.nombreCompleto,
        nombreGrupo: data.nombreGrupo,
        documentoIdentificacion: data.documentoIdentificacion,
        telefono: data.telefono,
        email: data.email.toLowerCase(),
        tematica: data.tematica,
        tipoVehiculo: data.tipoVehiculo,
        placa: data.placa.toUpperCase(),
        fechaRegistro: Timestamp.now()
      };

      // Guardar en Firestore
      const docRef = await addDoc(collection(this.db, 'vehiculos'), vehicleData);
      
      console.log('Vehículo registrado con ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al registrar vehículo: ', error);
      throw error;
    }
  }

  // Registrar una reserva en la colección 'reservas'
  // Ahora acepta un objeto payload con fecha, hora y campos adicionales
  async registrarReserva(payload: any): Promise<string> {
    try {
      const reservasRef = collection(this.db, 'reservas');

      const reservaData: any = {
        fecha: payload.fecha && payload.fecha instanceof Date ? Timestamp.fromDate(payload.fecha) : payload.fecha,
        horas: payload.horas || [],
        celebrante: payload.celebrante || null,
        telefono: payload.telefono || null,
        peregrinacion: payload.peregrinacion || null,
        coro: payload.coro || null,
        provincia: payload.provincia || null,
        parroquia: payload.parroquia || null,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(reservasRef, reservaData);
      console.log('Reserva registrada con ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al registrar reserva: ', error);
      throw error;
    }
  }

  // Valida credenciales contra la colección 'usuarios'.
  // Estructura esperada en Firestore: colección 'usuarios' con documentos que contienen
  // campos 'username' y 'password' (en texto plano en este ejemplo simple).
  // NOTA: Para producción usar Firebase Auth o contraseñas hasheadas.
  async validarCredenciales(username: string, password: string): Promise<boolean> {
    try {
      const usuariosRef = collection(this.db, 'usuarios');
      const q = query(usuariosRef, where('username', '==', username), where('password', '==', password));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error validando credenciales: ', error);
      return false;
    }
  }

  // Obtener todos los vehículos registrados (no en tiempo real)
  async obtenerVehiculos(): Promise<Array<any>> {
    try {
      const vehRef = collection(this.db, 'vehiculos');
      const snap = await getDocs(vehRef);
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      return items;
    } catch (error) {
      console.error('Error obteniendo vehículos: ', error);
      throw error;
    }
  }

  // Obtener todas las reservas (no en tiempo real)
  async obtenerReservas(): Promise<Array<any>> {
    try {
      const reservasRef = collection(this.db, 'reservas');
      const snap = await getDocs(reservasRef);
      const items: any[] = [];
      snap.forEach(docSnap => {
        const data: any = docSnap.data();
        items.push({
          id: docSnap.id,
          fecha: data.fecha && typeof data.fecha.toDate === 'function' ? data.fecha.toDate() : data.fecha,
          horas: data.horas || [],
          celebrante: data.celebrante,
          telefono: data.telefono,
          provincia: data.provincia,
          parroquia: data.parroquia,
          peregrinacion: data.peregrinacion,
          coro: data.coro,
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt
        });
      });
      return items;
    } catch (error) {
      console.error('Error obteniendo reservas: ', error);
      throw error;
    }
  }

  // Obtener reservas para una fecha específica
  async obtenerReservasPorFecha(fecha: Date): Promise<Array<any>> {
    try {
      const reservasRef = collection(this.db, 'reservas');
      
      // Crear rango de fecha (inicio y fin del día)
      const inicioDia = new Date(fecha);
      inicioDia.setHours(0, 0, 0, 0);
      
      const finDia = new Date(fecha);
      finDia.setHours(23, 59, 59, 999);
      
      // Consultar reservas en el rango de fecha
      const q = query(
        reservasRef,
        where('fecha', '>=', Timestamp.fromDate(inicioDia)),
        where('fecha', '<=', Timestamp.fromDate(finDia))
      );
      
      const snap = await getDocs(q);
      const items: any[] = [];
      snap.forEach(docSnap => {
        const data: any = docSnap.data();
        items.push({
          id: docSnap.id,
          fecha: data.fecha && typeof data.fecha.toDate === 'function' ? data.fecha.toDate() : data.fecha,
          horas: data.horas || [],
          celebrante: data.celebrante,
          provincia: data.provincia,
          parroquia: data.parroquia
        });
      });
      return items;
    } catch (error) {
      console.error('Error obteniendo reservas por fecha: ', error);
      throw error;
    }
  }

  // Eliminar un vehículo por ID
  async eliminarVehiculo(id: string): Promise<void> {
    try {
      const d = doc(this.db, 'vehiculos', id);
      await deleteDoc(d);
    } catch (error) {
      console.error('Error eliminando vehículo: ', error);
      throw error;
    }
  }

  // Eliminar una reserva por ID
  async eliminarReserva(id: string): Promise<void> {
    try {
      const d = doc(this.db, 'reservas', id);
      await deleteDoc(d);
    } catch (error) {
      console.error('Error eliminando reserva: ', error);
      throw error;
    }
  }

  // Actualizar una reserva por ID
  async actualizarReserva(id: string, payload: any): Promise<void> {
    try {
      const docRef = doc(this.db, 'reservas', id);
      const updateData: any = {
        fecha: payload.fecha && payload.fecha instanceof Date ? Timestamp.fromDate(payload.fecha) : payload.fecha,
        horas: payload.horas || [],
        celebrante: payload.celebrante,
        telefono: payload.telefono,
        provincia: payload.provincia,
        parroquia: payload.parroquia,
        peregrinacion: payload.peregrinacion || null,
        coro: payload.coro || null,
      };
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error actualizando reserva: ', error);
      throw error;
    }
  }

  // Obtener un vehículo por ID
  async obtenerVehiculoPorId(id: string): Promise<any | null> {
    try {
      const docRef = doc(this.db, 'vehiculos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo vehículo: ', error);
      throw error;
    }
  }

  // Validar un código QR
  async validarQR(id: string, validadoPor: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'vehiculos', id);
      await updateDoc(docRef, {
        validado: true,
        validadoAt: Timestamp.now(),
        validadoPor: validadoPor
      });
    } catch (error) {
      console.error('Error validando QR: ', error);
      throw error;
    }
  }
}
