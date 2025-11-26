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
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light">
  <style>
    * { color-scheme: light only !important; }
  </style>
</head>
<body style="margin: 0 !important; padding: 0 !important; font-family: Georgia, serif !important; background-color: #FFFFFF !important;">
  <div style="width: 100% !important; background-color: #FFFFFF !important; margin: 0 !important; padding: 0 !important;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF !important;">
    <tr>
      <td align="center" style="padding: 20px 10px !important; background-color: #FFFFFF !important;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF !important; border: 3px solid #DAA520 !important; border-radius: 12px;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #6B4423 !important; padding: 30px 20px !important; text-align: center !important; border-bottom: 4px solid #DAA520 !important;">
              <h1 style="color: #FFFFFF !important; margin: 0 0 10px 0 !important; font-size: 28px !important; font-family: Georgia, serif !important;">
                Santuario Mariano Nacional<br>del Carmen de la Asunción
              </h1>
              <p style="color: #FFD700 !important; margin: 0 !important; font-size: 16px !important; font-weight: bold !important; letter-spacing: 1px !important;">
                Pase del Niño Viajero 2025
              </p>
            </td>
          </tr>

          <!-- Saludo -->
          <tr>
            <td style="padding: 30px 30px 20px 30px !important; background-color: #FFFFFF !important;">
              <h2 style="color: #B8860B !important; margin: 0 0 15px 0 !important; font-size: 24px !important; font-family: Georgia, serif !important; border-bottom: 2px solid #DAA520 !important; padding-bottom: 10px !important;">
                ¡Bendiciones, ${nombre || ''}!
              </h2>
              <p style="color: #333333 !important; margin: 0 0 15px 0 !important; font-size: 16px !important; line-height: 1.7 !important;">
                Tu registro ha sido confirmado exitosamente para el <strong style="color: #B8860B !important;">Pase del Niño Viajero</strong> que se realizará el <strong style="color: #B8860B !important;">24 de diciembre de 2025 a las 10:00 am</strong>.
              </p>
              <p style="color: #666666 !important; margin: 0 !important; font-size: 15px !important; line-height: 1.7 !important;">
                Es un honor contar con tu participación en esta tradición tan especial de nuestra fe católica.
              </p>
            </td>
          </tr>
          
          <!-- QR Code Section -->
          <tr>
            <td style="padding: 0 30px 20px 30px !important; background-color: #FFFFFF !important;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFAF0 !important; border: 2px solid #B8860B !important; border-radius: 8px;">
                <tr>
                  <td style="padding: 25px !important; background-color: #FFFAF0 !important;">
                    <h3 style="color: #B8860B !important; margin: 0 0 15px 0 !important; font-size: 20px !important; font-family: Georgia, serif !important;">
                      Tu Código QR de Acceso
                    </h3>
                    <p style="color: #333333 !important; margin: 0 0 12px 0 !important; font-size: 15px !important; line-height: 1.6 !important;">
                      Descarga el archivo adjunto <strong style="color: #B8860B !important;">qr-code.png</strong> y guárdalo en tu dispositivo.
                    </p>
                    <p style="color: #333333 !important; margin: 0 !important; font-size: 15px !important; line-height: 1.6 !important;">
                      <strong style="color: #B8860B !important;">¡MUY IMPORTANTE!</strong> Presenta este código QR el día del evento para tu validación.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Punto de Concentración -->
          <tr>
            <td style="padding: 0 30px 20px 30px !important; background-color: #FFFFFF !important;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F5DC !important; border: 2px solid #B8860B !important; border-radius: 8px;">
                <tr>
                  <td style="padding: 25px !important; background-color: #F5F5DC !important;">
                    <h3 style="color: #B8860B !important; margin: 0 0 15px 0 !important; font-size: 20px !important; font-family: Georgia, serif !important;">
                      Punto de Concentración
                    </h3>
                    <p style="color: #333333 !important; margin: 0 0 15px 0 !important; font-size: 15px !important; line-height: 1.6 !important;">
                      <strong style="color: #B8860B !important;">Dirección:</strong><br>
                      Av. 3 de Noviembre y Simón Bolivar<br>
                      Cuenca - Ecuador
                    </p>

                    <!-- Botón de Google Maps -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 15px;">
                      <tr>
                        <td align="center">
                          <a href="https://www.google.com/maps?q=-2.895326072253961,-79.01550912890595" target="_blank" style="display: inline-block !important; padding: 12px 30px !important; background-color: #6B4423 !important; color: #FFFFFF !important; text-decoration: none !important; border-radius: 6px !important; font-weight: bold !important; font-size: 14px !important; border: 2px solid #DAA520 !important;">
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
          
          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 30px 30px 30px !important; background-color: #FFFFFF !important;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF9E6 !important; border-left: 4px solid #B8860B !important; border-radius: 6px;">
                <tr>
                  <td style="padding: 15px 20px !important; background-color: #FFF9E6 !important;">
                    <p style="color: #B8860B !important; margin: 0 0 12px 0 !important; font-size: 14px !important; line-height: 1.6 !important; font-weight: bold !important;">
                      ⚠️ Importante:
                    </p>
                    <p style="color: #333333 !important; margin: 0 0 10px 0 !important; font-size: 14px !important; line-height: 1.6 !important;">
                      • Este código QR es único y personal. No lo compartas con otras personas.
                    </p>
                    <p style="color: #333333 !important; margin: 0 !important; font-size: 14px !important; line-height: 1.6 !important;">
                      • El orden de ubicación será asignado según el orden de llegada al evento.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer con bendición -->
          <tr>
            <td style="background-color: #6B4423 !important; padding: 25px 30px !important; text-align: center !important; border-top: 4px solid #DAA520 !important;">
              <p style="color: #FFD700 !important; margin: 0 0 10px 0 !important; font-size: 15px !important; font-style: italic !important; line-height: 1.6 !important;">
                "Que el Niño Jesús bendiga tu hogar y tu familia"
              </p>
              <p style="color: #FFFFFF !important; margin: 0 !important; font-size: 13px !important;">
                Santuario Mariano Nacional del Carmen de la Asunción<br>
                Cuenca - Ecuador
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
  </div>
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
