# Configuración de Firebase

Para completar la integración con Firebase, sigue estos pasos:

## 1. Obtener la configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a "Configuración del proyecto" (ícono de engranaje)
4. En la sección "Tus apps", busca la configuración de tu aplicación web
5. Copia la configuración que se ve así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## 2. Actualizar el archivo environment.ts

Reemplaza los valores en `src/environments/environment.ts` y `src/environments/environment.prod.ts` con tu configuración real:

```typescript
export const environment = {
  production: false, // true para environment.prod.ts
  firebase: {
    apiKey: "TU_API_KEY_REAL",
    authDomain: "TU_AUTH_DOMAIN_REAL",
    projectId: "TU_PROJECT_ID_REAL",
    storageBucket: "TU_STORAGE_BUCKET_REAL",
    messagingSenderId: "TU_MESSAGING_SENDER_ID_REAL",
    appId: "TU_APP_ID_REAL"
  }
};
```

## 3. Configurar Firestore Database

1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Iniciar en modo de prueba" por ahora
4. Elige una ubicación para tu base de datos

## 4. Reglas de Firestore (Opcional)

Para permitir escritura sin autenticación (solo para pruebas), usa estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANTE**: Estas reglas permiten acceso completo. Para producción, implementa reglas de seguridad apropiadas.

## 5. Estructura de datos

Los vehículos se guardarán en la colección "vehiculos" con esta estructura:

```json
{
  "nombreCompleto": "Juan Pérez",
  "documentoIdentificacion": "12345678",
  "telefono": "3001234567",
  "email": "juan@email.com",
  "tematica": "clasico",
  "placa": "ABC123",
  "dimensiones": {
    "largo": 4.5,
    "ancho": 2.0,
    "alto": 1.8
  },
  "fechaRegistro": "Timestamp de Firebase"
}
```

Una vez que actualices la configuración, tu formulario estará listo para guardar datos en Firebase Firestore.
