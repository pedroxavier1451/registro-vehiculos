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
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #333333; margin: 0 0 20px 0;">¡Gracias por registrarte!</h2>
              <p style="color: #666666; margin: 0 0 10px 0;">Hola <strong>${nombre || ''}</strong>,</p>
              <p style="color: #666666; margin: 0;">Tu registro ha sido confirmado exitosamente para el <strong>Pase del Niño Viajero</strong> del <strong>24 de diciembre de 2025</strong>.</p>
            </td>
          </tr>
          
          <!-- Info Box -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e8f5e9; border-left: 4px solid #4caf50;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #2e7d32; margin: 0 0 10px 0;">Tu Código QR de Acceso</h3>
                    <p style="color: #1b5e20; margin: 0 0 10px 0;">Descarga el archivo adjunto <strong>qr-code.png</strong> y guárdalo en tu dispositivo para presentarlo el día del evento.</p>
                    <p style="color: #1b5e20; margin: 0;"><strong>¡IMPORTANTE!</strong> Presenta este código QR el día del evento.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Location Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e3f2fd; border-left: 4px solid #2196f3;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #1565c0; margin: 0 0 15px 0;">Punto de Concentración</h3>
                    <p style="color: #0d47a1; margin: 0 0 10px 0; font-size: 14px;">
                      <strong>Dirección:</strong> Av. 3 de Noviembre y Simón Bolivar, Cuenca - Ecuador
                    </p>

                    <!-- Botón de Google Maps -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;">
                      <tr>
                        <td align="center" style="padding: 5px;">
                          <a href="https://www.google.com/maps?q=-2.895326072253961,-79.01550912890595" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #2196f3; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px;">
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
          
          <!-- Footer -->
          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff3e0;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="color: #e65100; margin: 0; font-size: 14px;">⚠️ <strong>Nota:</strong> Este código QR es único y personal. No lo compartas con nadie.</p>
                  </td>
                </tr>
              </table>
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
    subject: 'Gracias por registrarte - Tu código QR',
    text: `Hola ${nombre || ''},\n\nGracias por registrarte en el evento.\n\nPor favor presenta tu código QR el día del evento.\n\nSaludos,\nEl equipo.`,
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
