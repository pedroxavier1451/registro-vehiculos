// Contenido de la Política de Privacidad y Protección de Datos Personales del Pase del Niño Viajero.
import { DocumentoLegal } from './terminos.constants';

export const PRIVACIDAD: DocumentoLegal = {
  titulo: 'Política de Privacidad y Protección de Datos Personales',
  icono: 'pi pi-shield',
  actualizacion: '4 de noviembre de 2026',
  secciones: [
    {
      id: 'introduccion',
      indice: 'Introducción',
      titulo: 'Introducción',
      bloques: [
        { tipo: 'p', texto: 'El Monasterio del Carmen de la Asunción reconoce la importancia de proteger la privacidad y los datos personales de quienes participan en sus actividades religiosas, culturales y comunitarias.' },
        { tipo: 'p', texto: 'La presente Política de Privacidad tiene como finalidad informar sobre la recopilación, utilización, almacenamiento y protección de los datos personales proporcionados a través de su plataforma web, especialmente durante el proceso de inscripción de participantes, vehículos y carros alegóricos del Pase del Niño Viajero.' },
        { tipo: 'p', texto: 'El tratamiento de los datos personales se realizará de conformidad con la Ley Orgánica de Protección de Datos Personales del Ecuador, su Reglamento General y demás normativa aplicable.' }
      ]
    },
    {
      id: 'responsable',
      indice: 'Responsable',
      titulo: 'Responsable del tratamiento de datos personales',
      bloques: [
        { tipo: 'p', texto: 'El Monasterio del Carmen de la Asunción, ubicado en Cuenca, Ecuador, es la institución organizadora del proceso de inscripción y registro de participantes, vehículos y carros alegóricos del Pase del Niño Viajero.' },
        { tipo: 'p', texto: 'La institución será responsable del tratamiento de los datos personales recopilados a través de la plataforma, siempre que actúe como entidad que determina las finalidades y los medios de dicho tratamiento.' },
        { tipo: 'p', texto: 'Datos institucionales:' },
        {
          tipo: 'ul',
          items: [
            'Institución: Monasterio del Carmen de la Asunción.',
            'Domicilio legal: Mariscal Sucre y Padre Aguirre.',
            'Ciudad: Cuenca, Ecuador.',
            'Correo electrónico de contacto: info@monasteriocarmenasuncionocd.com',
            'Teléfono: (07) 2823450.'
          ]
        },
        { tipo: 'p', texto: 'Los participantes podrán utilizar los canales institucionales indicados para realizar consultas relacionadas con el tratamiento de sus datos personales.' }
      ]
    },
    {
      id: 'informacion',
      indice: 'Información recopilada',
      titulo: 'Información que recopilamos',
      bloques: [
        { tipo: 'p', texto: 'Durante el proceso de inscripción y registro, la plataforma podrá recopilar la siguiente información, según los campos habilitados:' },
        {
          tipo: 'ul',
          items: [
            'Nombres y apellidos del participante o responsable del registro.',
            'Número de cédula o documento de identificación, cuando corresponda.',
            'Número de teléfono o contacto.',
            'Dirección de correo electrónico.',
            'Información del vehículo, incluyendo placa, tipo de vehículo y características necesarias para su registro.',
            'Información relacionada con el carro alegórico y su participación en el evento.',
            'Fecha y hora del registro.',
            'Constancia de aceptación de los términos y condiciones de participación.',
            'Autorización o rechazo para recibir comunicaciones informativas futuras.'
          ]
        },
        { tipo: 'p', texto: 'La información será proporcionada directamente por los participantes o sus representantes autorizados.' },
        { tipo: 'p', texto: 'Se solicitarán únicamente los datos adecuados y necesarios para las finalidades descritas en esta política.' }
      ]
    },
    {
      id: 'finalidades',
      indice: 'Finalidades',
      titulo: 'Finalidades del uso de los datos personales',
      bloques: [
        { tipo: 'p', texto: 'Los datos personales recopilados serán utilizados para las siguientes finalidades:' },
        { tipo: 'h4', texto: '4.1. Registro y organización del evento' },
        {
          tipo: 'ul',
          items: [
            'Registrar a los participantes, vehículos y carros alegóricos.',
            'Verificar la información proporcionada durante la inscripción.',
            'Gestionar y organizar la participación en el Pase del Niño Viajero.',
            'Coordinar aspectos logísticos y operativos de la celebración.',
            'Enviar confirmaciones de inscripción y códigos QR.',
            'Comunicar instrucciones, disposiciones y novedades relacionadas con la participación.',
            'Contactar a los responsables de los vehículos cuando sea necesario para la organización del evento.',
            'Mantener registros administrativos necesarios para el desarrollo y seguimiento de las inscripciones.'
          ]
        },
        { tipo: 'h4', texto: '4.2. Comunicaciones informativas futuras' },
        { tipo: 'p', texto: 'Cuando el participante otorgue voluntariamente su autorización, sus datos de contacto también podrán utilizarse para enviar:' },
        {
          tipo: 'ul',
          items: [
            'Información sobre futuras ediciones del Pase del Niño Viajero.',
            'Noticias y novedades del Monasterio del Carmen de la Asunción.',
            'Invitaciones a actividades religiosas, culturales y comunitarias.',
            'Convocatorias y anuncios relacionados con eventos organizados por la institución.'
          ]
        },
        { tipo: 'p', texto: 'La autorización para recibir futuras comunicaciones es opcional y no constituye un requisito para completar la inscripción.' }
      ]
    },
    {
      id: 'base-legal',
      indice: 'Base legal',
      titulo: 'Base legal para el tratamiento de datos',
      bloques: [
        { tipo: 'p', texto: 'El tratamiento de los datos personales se realizará conforme a las bases legales previstas en la Ley Orgánica de Protección de Datos Personales del Ecuador.' },
        { tipo: 'p', texto: 'Para los datos necesarios para gestionar la inscripción y participación en el evento, el tratamiento se fundamentará en la base legal aplicable a dicha actividad, previamente determinada por la institución.' },
        { tipo: 'p', texto: 'Para el envío de información, noticias y convocatorias futuras, el tratamiento se basará en el consentimiento libre, específico, informado e inequívoco del titular.' },
        { tipo: 'p', texto: 'La aceptación de los términos y condiciones de participación no supondrá la aceptación automática de comunicaciones futuras.' }
      ]
    },
    {
      id: 'proteccion',
      indice: 'Protección y confidencialidad',
      titulo: 'Protección y confidencialidad de la información',
      bloques: [
        { tipo: 'p', texto: 'El Monasterio del Carmen de la Asunción se compromete a implementar medidas de seguridad técnicas y organizativas apropiadas para proteger los datos personales contra accesos no autorizados, pérdida, alteración, divulgación o uso indebido.' },
        { tipo: 'p', texto: 'El acceso a la información estará limitado a las personas autorizadas que la necesiten para cumplir las finalidades establecidas en esta política.' },
        { tipo: 'p', texto: 'Los datos personales no serán vendidos ni comercializados.' },
        { tipo: 'p', texto: 'La institución procurará mantener la confidencialidad, integridad y disponibilidad de la información almacenada en sus sistemas.' }
      ]
    },
    {
      id: 'terceros',
      indice: 'Servicios y terceros',
      titulo: 'Uso de servicios tecnológicos y terceros',
      bloques: [
        { tipo: 'p', texto: 'Para el funcionamiento de la plataforma web, el Monasterio podrá utilizar servicios tecnológicos relacionados con:' },
        {
          tipo: 'ul',
          items: [
            'Alojamiento y funcionamiento del sitio web.',
            'Almacenamiento y administración de registros.',
            'Generación de comprobantes y códigos QR.',
            'Envío de correos electrónicos y notificaciones.',
            'Seguridad y mantenimiento de la plataforma.'
          ]
        },
        { tipo: 'p', texto: 'Cuando estos servicios impliquen el tratamiento de datos por proveedores externos, se aplicarán las condiciones y garantías de protección correspondientes.' },
        { tipo: 'p', texto: 'Los datos no serán comercializados ni cedidos a terceros para fines publicitarios propios de dichos terceros.' },
        { tipo: 'p', texto: 'Las comunicaciones o transferencias nacionales o internacionales que resulten aplicables deberán cumplir las exigencias de la legislación ecuatoriana.' }
      ]
    },
    {
      id: 'conservacion',
      indice: 'Conservación',
      titulo: 'Conservación de los datos personales',
      bloques: [
        { tipo: 'p', texto: 'El Monasterio del Carmen de la Asunción conservará los datos personales recopilados a través de su plataforma web para gestionar las inscripciones, organizar el Pase del Niño Viajero, mantener un registro de participación y atender las necesidades administrativas relacionadas con el evento, durante los períodos necesarios para dichas finalidades y conforme a la normativa vigente.' },
        { tipo: 'p', texto: 'Adicionalmente, los datos de contacto de los participantes que hayan autorizado expresamente recibir futuras comunicaciones podrán conservarse después de finalizado el evento, con la finalidad de mantenerlos informados sobre próximas ediciones del Pase del Niño Viajero, noticias, actividades, eventos y convocatorias organizadas por el Monasterio del Carmen de la Asunción.' },
        { tipo: 'p', texto: 'Estos datos de contacto se conservarán mientras el consentimiento del titular permanezca vigente y continúe siendo necesario utilizarlos para las finalidades informativas autorizadas, sujeto a revisiones periódicas de su necesidad y pertinencia.' },
        { tipo: 'p', texto: 'Los participantes podrán retirar su consentimiento en cualquier momento, solicitando dejar de recibir comunicaciones a través de los canales institucionales habilitados.' },
        { tipo: 'p', texto: 'Cuando se retire el consentimiento o los datos dejen de ser necesarios para las finalidades autorizadas, se procederá a su eliminación o anonimización, salvo aquellos que deban conservarse por una obligación legal u otra base jurídica aplicable.' },
        { tipo: 'p', texto: 'El Monasterio del Carmen de la Asunción se compromete a utilizar la información exclusivamente para las finalidades comunicadas a los participantes y a protegerla conforme a la legislación ecuatoriana de protección de datos personales.' }
      ]
    },
    {
      id: 'derechos',
      indice: 'Derechos de los titulares',
      titulo: 'Derechos de los titulares',
      bloques: [
        { tipo: 'p', texto: 'Las personas que proporcionen sus datos personales podrán ejercer los derechos reconocidos por la legislación ecuatoriana, cuando resulten aplicables, entre ellos:' },
        {
          tipo: 'ul',
          items: [
            'Acceso: conocer qué datos personales se mantienen registrados.',
            'Rectificación y actualización: solicitar la corrección de información incorrecta o desactualizada.',
            'Eliminación: solicitar la supresión de sus datos cuando corresponda legalmente.',
            'Oposición: oponerse a determinados tratamientos en los casos previstos por la ley.',
            'Suspensión o limitación: solicitar la suspensión o limitación del tratamiento cuando corresponda.',
            'Portabilidad: solicitar sus datos en los casos legalmente previstos.',
            'Revocación del consentimiento: retirar las autorizaciones previamente otorgadas.',
            'Decisiones automatizadas: ejercer los derechos reconocidos frente a decisiones basadas únicamente en tratamientos automatizados, cuando corresponda.'
          ]
        },
        { tipo: 'p', texto: 'Para ejercer estos derechos, los titulares podrán enviar una solicitud al correo electrónico institucional señalado en esta política.' },
        { tipo: 'p', texto: 'Las solicitudes serán atendidas conforme a los procedimientos y plazos establecidos por la legislación vigente.' },
        { tipo: 'p', texto: 'Los titulares también podrán presentar reclamaciones ante la Superintendencia de Protección de Datos Personales del Ecuador.' }
      ]
    },
    {
      id: 'autorizacion',
      indice: 'Comunicaciones futuras',
      titulo: 'Autorización para recibir futuras comunicaciones',
      bloques: [
        { tipo: 'p', texto: 'Durante el proceso de inscripción, los participantes podrán decidir voluntariamente si desean recibir información, noticias y convocatorias futuras del Monasterio del Carmen de la Asunción.' },
        { tipo: 'p', texto: 'Esta autorización se solicitará mediante una casilla independiente de la aceptación de los términos y condiciones.' },
        { tipo: 'p', texto: 'La casilla de autorización para futuras comunicaciones no estará seleccionada de manera predeterminada.' },
        { tipo: 'p', texto: 'La decisión de no autorizar estas comunicaciones no impedirá completar el registro ni participar en el evento.' }
      ]
    },
    {
      id: 'retiro',
      indice: 'Retiro del consentimiento',
      titulo: 'Retiro del consentimiento',
      bloques: [
        { tipo: 'p', texto: 'Los participantes podrán retirar en cualquier momento su consentimiento para recibir futuras comunicaciones.' },
        { tipo: 'p', texto: 'Para ello, podrán enviar una solicitud al correo electrónico institucional de contacto o utilizar los mecanismos de cancelación que se habiliten en los mensajes enviados.' },
        { tipo: 'p', texto: 'Una vez recibida y tramitada la solicitud, la institución dejará de utilizar los datos de contacto para esa finalidad, salvo que exista otra base legal válida para un tratamiento diferente.' },
        { tipo: 'p', texto: 'La revocación del consentimiento no afectará la licitud de los tratamientos realizados válidamente con anterioridad.' }
      ]
    },
    {
      id: 'veracidad',
      indice: 'Veracidad',
      titulo: 'Veracidad de la información',
      bloques: [
        { tipo: 'p', texto: 'Los participantes deberán proporcionar información correcta y actualizada durante el proceso de inscripción.' },
        { tipo: 'p', texto: 'La entrega de información incorrecta o incompleta podría dificultar la confirmación del registro, la comunicación con los participantes o la coordinación de su participación en el evento.' },
        { tipo: 'p', texto: 'En caso de requerirse alguna corrección, los participantes podrán solicitarla mediante los canales institucionales habilitados.' }
      ]
    },
    {
      id: 'automatizadas',
      indice: 'Decisiones automatizadas',
      titulo: 'Decisiones automatizadas',
      bloques: [
        { tipo: 'p', texto: 'La plataforma podrá realizar procesos tecnológicos automáticos relacionados con el registro de información, la generación de códigos QR y el envío de confirmaciones.' },
        { tipo: 'p', texto: 'Estas operaciones no implicarán, por sí mismas, la adopción de decisiones con efectos jurídicos o significativamente similares basadas exclusivamente en valoraciones automatizadas de los participantes.' },
        { tipo: 'p', texto: 'Si en el futuro se incorporan mecanismos de evaluación automatizada o elaboración de perfiles que afecten a los titulares, la institución proporcionará la información correspondiente y aplicará las garantías legales exigibles.' }
      ]
    },
    {
      id: 'modificaciones',
      indice: 'Modificaciones',
      titulo: 'Modificaciones a la Política de Privacidad',
      bloques: [
        { tipo: 'p', texto: 'El Monasterio del Carmen de la Asunción podrá actualizar esta Política de Privacidad para adaptarla a cambios legales, tecnológicos u organizativos.' },
        { tipo: 'p', texto: 'Las modificaciones serán publicadas en la plataforma web, indicando la fecha de su última actualización.' },
        { tipo: 'p', texto: 'Cuando se incorporen nuevas finalidades que requieran consentimiento, se solicitará la autorización correspondiente antes de realizar el tratamiento.' }
      ]
    },
    {
      id: 'contacto',
      indice: 'Contacto',
      titulo: 'Contacto',
      bloques: [
        { tipo: 'p', texto: 'Para consultas, solicitudes o inquietudes relacionadas con la privacidad y protección de datos personales, los participantes podrán comunicarse con:' },
        {
          tipo: 'ul',
          items: [
            'Monasterio del Carmen de la Asunción — Cuenca, Ecuador',
            'Correo electrónico: info@monasteriocarmenasuncionocd.com',
            'Teléfono: (07) 2823450',
            'Domicilio legal: Mariscal Sucre y Padre Aguirre, Cuenca'
          ]
        },
        { tipo: 'p', texto: 'Las solicitudes relacionadas con datos personales serán atendidas conforme a la normativa vigente.' }
      ]
    }
  ],
  cierre: {
    titulo: 'Compromiso institucional',
    texto: 'El Monasterio del Carmen de la Asunción reafirma su compromiso con el respeto a la privacidad, la confidencialidad y la protección de los datos personales de quienes participan en el Pase del Niño Viajero y en sus demás actividades religiosas, culturales y comunitarias.'
  }
};
