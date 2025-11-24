import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';

export interface VehicleRegistration {
  // Datos personales
  nombreCompleto: string;
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

  async registrarVehiculo(data: any): Promise<string> {
    try {
      // Preparar los datos para Firebase
      const vehicleData: VehicleRegistration = {
        nombreCompleto: data.nombreCompleto,
        documentoIdentificacion: data.documentoIdentificacion,
        telefono: data.telefono,
        email: data.email,
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
