const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { defineString } = require('firebase-functions/params');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
// Don't require/sendgrid at top-level to avoid blocking initialization
let sgMail: any = null;

admin.initializeApp();

// Define params for Cloud Functions v2
const SENDGRID_KEY = defineString('SENDGRID_KEY');

const SENDGRID_FROM = defineString('SENDGRID_FROM');

/**
 * Genera un código QR en formato base64
 */
async function generateQRCode(data: string): Promise<string> {
  try {
    // Generar QR como data URL (base64)
    const qrDataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2
    });
    return qrDataUrl;
  } catch (err) {
    throw new Error('Error generating QR code: ' + err);
  }
}

/**
 * Helper to send a simple welcome email via SendGrid with QR code
 */
async function sendWelcomeEmailTo(email: string, nombre?: string, qrCodeDataUrl?: string) {
  // Lazy-require SendGrid so module loading doesn't fail or block deploy analysis
  const sendgridKeyValue = SENDGRID_KEY.value();
  const sendgridFromValue = SENDGRID_FROM.value();

  if (!sgMail) {
    try {
      // use require here to avoid top-level side effects
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      sgMail = require('@sendgrid/mail');
    } catch (err: any) {
      throw new Error('@sendgrid/mail module is not installed');
    }

    if (sendgridKeyValue) {
      sgMail.setApiKey(sendgridKeyValue);
    }
  }

  if (!sendgridKeyValue) {
    throw new Error('SendGrid key not configured');
  }

  // Extraer el base64 del data URL
  let base64Content = '';
  if (qrCodeDataUrl && qrCodeDataUrl.startsWith('data:image')) {
    base64Content = qrCodeDataUrl.split(',')[1];
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <style>
    :root {
      color-scheme: light only;
    }
    @media (prefers-color-scheme: dark) {
      .email-wrapper {
        background-color: #F5F1E8 !important;
      }
      .email-card {
        background-color: #FFFEF7 !important;
      }
      .text-dark {
        color: #2C1810 !important;
      }
      .text-brown {
        color: #5D4037 !important;
      }
      .text-red {
        color: #8B0000 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', 'Crimson Text', serif; background-color: #F5F1E8 !important;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-wrapper" style="background-color: #F5F1E8 !important;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" class="email-card" style="background-color: #FFFEF7 !important; border: 3px solid #DAA520; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(139, 0, 0, 0.15);">
          
          <!-- Header con gradiente marrón -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A2C1A 0%, #523319 100%); padding: 30px 20px; text-align: center; border-bottom: 4px solid #DAA520;">
              <h1 style="color: #FFFEF7; margin: 0 0 10px 0; font-size: 28px; font-family: 'Georgia', serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                Santuario Mariano Nacional<br>del Carmen de la Asunción
              </h1>
              <p style="color: #DAA520; margin: 0; font-size: 16px; font-weight: bold; letter-spacing: 1px;">
                Pase del Niño Viajero 2025
              </p>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding: 30px 30px 20px 30px; background-color: #FFFEF7 !important;">
              <h2 class="text-red" style="color: #8B0000 !important; margin: 0 0 15px 0; font-size: 24px; font-family: 'Georgia', serif; border-bottom: 2px solid #D7CCC8; padding-bottom: 10px;">
                ¡Bendiciones, ${nombre || ''}!
              </h2>
              <p class="text-dark" style="color: #2C1810 !important; margin: 0 0 15px 0; font-size: 16px; line-height: 1.7;">
                Tu registro ha sido confirmado exitosamente para el <strong class="text-red" style="color: #8B0000 !important;">Pase del Niño Viajero</strong> que se realizará el <strong class="text-red" style="color: #8B0000 !important;">24 de diciembre de 2025 a las 10:00 am</strong>.
              </p>
              <p class="text-brown" style="color: #5D4037 !important; margin: 0; font-size: 15px; line-height: 1.7;">
                Es un honor contar con tu participación en esta tradición tan especial de nuestra fe católica.
              </p>
            </td>
          </tr>
          
          <!-- QR Code Section con colores católicos -->
          <tr>
            <td style="padding: 0 30px 20px 30px; background-color: #FFFEF7 !important;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #FFF9E6 0%, #F5F1E8 100%) !important; border: 2px solid #B8860B; border-radius: 8px; box-shadow: 0 4px 12px rgba(139, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 25px; background-color: #FFF9E6 !important;">
                    <h3 class="text-red" style="color: #8B0000 !important; margin: 0 0 15px 0; font-size: 20px; font-family: 'Georgia', serif;">
                      Tu Código QR de Acceso
                    </h3>
                    <p class="text-dark" style="color: #2C1810 !important; margin: 0 0 12px 0; font-size: 15px; line-height: 1.6;">
                      Descarga el archivo adjunto <strong class="text-red" style="color: #8B0000 !important;">qr-code.png</strong> y guárdalo en tu dispositivo.
                    </p>
                    <p class="text-dark" style="color: #2C1810 !important; margin: 0; font-size: 15px; line-height: 1.6;">
                      <strong class="text-red" style="color: #8B0000 !important;">¡MUY IMPORTANTE!</strong> Presenta este código QR el día del evento para tu validación.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Punto de Concentración con colores católicos -->
          <tr>
            <td style="padding: 0 30px 20px 30px; background-color: #FFFEF7 !important;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #E8DCC8 0%, #F5F1E8 100%) !important; border: 2px solid #8B0000; border-radius: 8px; box-shadow: 0 4px 12px rgba(139, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 25px; background-color: #E8DCC8 !important;">
                    <h3 class="text-red" style="color: #8B0000 !important; margin: 0 0 15px 0; font-size: 20px; font-family: 'Georgia', serif;">
                      Punto de Concentración
                    </h3>
                    <p class="text-dark" style="color: #2C1810 !important; margin: 0 0 15px 0; font-size: 15px; line-height: 1.6;">
                      <strong class="text-red" style="color: #8B0000 !important;">Dirección:</strong><br>
                      Av. 3 de Noviembre y Simón Bolivar<br>
                      Cuenca - Ecuador
                    </p>

                    <!-- Botón de Google Maps con estilo católico -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 15px;">
                      <tr>
                        <td align="center">
                          <a href="https://www.google.com/maps?q=-2.895326072253961,-79.01550912890595" target="_blank" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8B0000 0%, #660000 100%) !important; color: #FFFEF7 !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; border: 2px solid #DAA520; box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);">
                            Ver Ubicación en Google Maps
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Warning Box con estilo católico -->
          <tr>
            <td style="padding: 0 30px 20px 30px; background-color: #FFFEF7 !important;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF9E6 !important; border-left: 4px solid #B8860B; border-radius: 6px;">
                <tr>
                  <td style="padding: 15px 20px; background-color: #FFF9E6 !important;">
                    <p style="color: #8B0000 !important; margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; font-weight: bold;">
                      ⚠️ Importante:
                    </p>
                    <p style="color: #2C1810 !important; margin: 0 0 10px 0; font-size: 14px; line-height: 1.6;">
                      • Este código QR es único y personal. No lo compartas con otras personas.
                    </p>
                    <p style="color: #2C1810 !important; margin: 0; font-size: 14px; line-height: 1.6;">
                      • El orden de ubicación será asignado según el orden de llegada al evento.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer con bendición -->
          <tr>
            <td style="background: linear-gradient(135deg, #4A2C1A 0%, #523319 100%); padding: 25px 30px; text-align: center; border-top: 4px solid #DAA520;">
              <p style="color: #DAA520; margin: 0 0 10px 0; font-size: 15px; font-style: italic; line-height: 1.6;">
                "Que el Niño Jesús bendiga tu hogar y tu familia"
              </p>
              <p style="color: #FFFEF7; margin: 0; font-size: 13px;">
                Santuario Mariano Nacional del Carmen de la Asunción<br>
                Cuenca - Ecuador
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  if (functions && functions.logger && functions.logger.info) {
    functions.logger.info('Preparando email', { 
      email, 
      hasQR: !!qrCodeDataUrl,
      qrLength: qrCodeDataUrl ? qrCodeDataUrl.length : 0,
      base64Length: base64Content.length
    });
  }

  const msg: any = {
    to: email,
    from: sendgridFromValue,
    subject: 'Confirmación de Registro - Pase del Niño Viajero 2025',
    text: `Bendiciones ${nombre || ''},\n\nTu registro para el Pase del Niño Viajero del 24 de diciembre de 2025 ha sido confirmado exitosamente.\n\nDescarga el archivo adjunto qr-code.png y preséntalo el día del evento.\n\nPunto de concentración: Av. 3 de Noviembre y Simón Bolivar, Cuenca - Ecuador\n\nQue el Niño Jesús bendiga tu hogar y tu familia.\n\nSantuario Mariano Nacional del Carmen de la Asunción\nCuenca - Ecuador`,
    html: htmlContent,
    attachments: []
  };

  // Agregar QR como archivo adjunto descargable
  if (base64Content) {
    msg.attachments.push({
      content: base64Content,
      filename: 'qr-code.png',
      type: 'image/png',
      disposition: 'attachment'
    });
  }

  return sgMail.send(msg);
}

// 1) Firestore trigger: envia un correo cuando se crea un documento en 'vehiculos'
// Use v2 API to be compatible with firebase-functions v7+
const { onDocumentCreated } = require('firebase-functions/v2/firestore');

export const sendWelcomeOnCreate = onDocumentCreated('vehiculos/{docId}', async (event: any) => {
  // event.data is a Firestore snapshot-like object in v2; adapt accordingly
  const snap = event.data;
  const data = (snap && typeof snap.data === 'function') ? snap.data() : (snap || {});
  const email = data.email;
  const nombre = data.nombreCompleto;
  const params = event.params || {};
  const docId = params.docId;

  if (!email) {
    if (functions && functions.logger && functions.logger.info) {
      functions.logger.info('Documento creado sin email - no se enviará correo', { docId });
    }
    return null;
  }

  try {
    // 1. Generar token único
    const qrToken = uuidv4();
    const now = admin.firestore.Timestamp.now();
    
    if (functions && functions.logger && functions.logger.info) {
      functions.logger.info('Generando QR para registro', { docId, qrToken });
    }

    // 2. Actualizar el documento con los campos del QR
    const db = admin.firestore();
    await db.collection('vehiculos').doc(docId).update({
      qrToken: qrToken,
      qrGeneratedAt: now,
      validado: false,
      validadoAt: null,
      validadoPor: null
    });

    // 3. Generar código QR con el token
    const qrData = `${qrToken}|${docId}`; // Formato: token|docId
    const qrCodeDataUrl = await generateQRCode(qrData);
    
    if (functions && functions.logger && functions.logger.info) {
      functions.logger.info('QR generado exitosamente', { 
        docId, 
        qrDataLength: qrCodeDataUrl ? qrCodeDataUrl.length : 0,
        qrPrefix: qrCodeDataUrl ? qrCodeDataUrl.substring(0, 50) : 'undefined'
      });
    }

    // 4. Enviar correo con QR
    const resp = await sendWelcomeEmailTo(email, nombre, qrCodeDataUrl);
    
    if (functions && functions.logger && functions.logger.info) {
      functions.logger.info('sendWelcomeOnCreate: correo con QR enviado', { 
        email, 
        docId,
        qrToken,
        hasQR: !!qrCodeDataUrl,
        status: resp && resp[0] && resp[0].statusCode 
      });
    }
  } catch (err: any) {
    if (functions && functions.logger && functions.logger.error) {
      functions.logger.error('sendWelcomeOnCreate: error', { 
        error: err.message, 
        stack: err.stack,
        docId 
      });
    }
  }

  return null;
});

// 2) Callable function: invocación explícita desde cliente con SDK httpsCallable
const { onCall } = require('firebase-functions/v2/https');

export const sendWelcomeCallable = onCall(async (data: any, context: any) => {
  const email = data && data.email;
  const nombre = data && data.nombreCompleto;

  if (!email) {
    // v2 onCall handlers should return an error object; throw to signal failure
    throw new Error('Missing email');
  }

  try {
    await sendWelcomeEmailTo(email, nombre);
    return { success: true };
  } catch (err: any) {
    if (functions && functions.logger && functions.logger.error) {
      functions.logger.error('sendWelcomeCallable error', err);
    }
    throw new Error('Error sending email');
  }
});

// 3) HTTP endpoint (onRequest) with simple CORS handling for direct fetch calls (for testing)
const { onRequest } = require('firebase-functions/v2/https');

export const sendWelcomeHttp = onRequest(async (req: any, res: any) => {
  // Basic CORS handling - allow any origin. For production restrict origins.
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const body = req.method === 'GET' ? req.query : req.body;
  const email = body && body.email;
  const nombre = body && body.nombreCompleto;

  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }

  try {
    await sendWelcomeEmailTo(String(email), String(nombre || ''));
    res.json({ success: true });
  } catch (err: any) {
    functions.logger.error('sendWelcomeHttp error', err);
    res.status(500).json({ error: 'Error sending email' });
  }
});
