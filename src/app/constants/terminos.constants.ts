// Contenido de los Términos y Condiciones de Participación del Pase del Niño Viajero.
// Cada sección se compone de bloques: párrafos ('p'), subtítulos ('h4') o listas con viñetas ('ul').

export interface BloqueLegal {
  tipo: 'p' | 'h4' | 'ul';
  texto?: string;
  items?: string[];
}

export interface SeccionLegal {
  id: string;
  indice: string;   // Texto corto para el menú lateral
  titulo: string;   // Título completo de la sección
  bloques: BloqueLegal[];
}

// Documento completo que se muestra en el modal legal (términos o privacidad)
export interface DocumentoLegal {
  titulo: string;
  icono: string;
  actualizacion: string;
  secciones: SeccionLegal[];
  cierre: { titulo: string; texto: string };
}

export const TERMINOS_ULTIMA_ACTUALIZACION = '4 de noviembre de 2026';

export const TERMINOS_SECCIONES: SeccionLegal[] = [
  {
    id: 'objeto',
    indice: 'Objeto',
    titulo: 'Objeto',
    bloques: [
      { tipo: 'p', texto: 'Los presentes Términos y Condiciones tienen como finalidad establecer las disposiciones generales para la inscripción y participación de vehículos y carros alegóricos en el Pase del Niño Viajero, celebración religiosa y cultural que se realiza tradicionalmente cada 24 de diciembre en la ciudad de Cuenca, Ecuador.' },
      { tipo: 'p', texto: 'El proceso de registro es organizado por el Monasterio del Carmen de la Asunción, con el propósito de facilitar la planificación, coordinación y organización de los vehículos participantes.' }
    ]
  },
  {
    id: 'aceptacion',
    indice: 'Aceptación',
    titulo: 'Aceptación de los términos y condiciones',
    bloques: [
      { tipo: 'p', texto: 'Al completar el formulario de inscripción y aceptar los presentes Términos y Condiciones, el participante declara haber leído, comprendido y aceptado las disposiciones establecidas para su participación en el evento.' },
      { tipo: 'p', texto: 'La aceptación de estas condiciones constituye un requisito obligatorio para completar el registro.' }
    ]
  },
  {
    id: 'registro',
    indice: 'Registro',
    titulo: 'Registro de participantes y vehículos',
    bloques: [
      { tipo: 'p', texto: 'La inscripción se realizará a través de la plataforma web habilitada para el evento.' },
      { tipo: 'p', texto: 'Los participantes deberán proporcionar información verídica, completa y actualizada sobre el responsable del registro y el vehículo participante.' },
      { tipo: 'p', texto: 'Cada registro deberá corresponder a un vehículo o carro alegórico, salvo que la organización establezca un procedimiento diferente.' },
      { tipo: 'p', texto: 'El participante será responsable de verificar la exactitud de los datos proporcionados.' },
      { tipo: 'p', texto: 'La emisión de un comprobante o código QR acredita la recepción del registro, pero no constituye una autorización para incumplir las disposiciones de seguridad, tránsito u organización aplicables.' }
    ]
  },
  {
    id: 'vehiculos',
    indice: 'Vehículos participantes',
    titulo: 'Vehículos participantes',
    bloques: [
      { tipo: 'p', texto: 'Podrán registrarse los vehículos que cumplan las características y condiciones establecidas por la organización para participar en el desfile.' },
      { tipo: 'p', texto: 'Por razones de seguridad, movilidad y organización, no se permitirá la inscripción de los siguientes tipos de vehículos:' },
      { tipo: 'ul', items: ['Camiones de carga pesada.', 'Vehículos de doble eje.', 'Tráileres.', 'Buses.', 'Volquetas.'] },
      { tipo: 'p', texto: 'La organización podrá establecer restricciones adicionales, debidamente comunicadas a los participantes, cuando sean necesarias por razones técnicas, de seguridad o por disposiciones de las autoridades competentes.' }
    ]
  },
  {
    id: 'seguridad',
    indice: 'Condiciones de seguridad',
    titulo: 'Condiciones de seguridad',
    bloques: [
      { tipo: 'p', texto: 'Los participantes deberán procurar que sus vehículos se encuentren en condiciones mecánicas y operativas adecuadas para su circulación.' },
      { tipo: 'p', texto: 'Los conductores deberán contar con la documentación y habilitaciones legalmente exigibles para conducir el vehículo correspondiente.' },
      { tipo: 'p', texto: 'Las estructuras, decoraciones y elementos utilizados en los carros alegóricos deberán estar correctamente asegurados y no representar riesgos para sus ocupantes, otros participantes o espectadores.' },
      { tipo: 'p', texto: 'No deberán utilizarse elementos peligrosos o instalaciones que comprometan la estabilidad, visibilidad o seguridad del vehículo.' },
      { tipo: 'p', texto: 'Los participantes deberán cumplir las normas de tránsito y las disposiciones emitidas por las autoridades competentes.' }
    ]
  },
  {
    id: 'menores',
    indice: 'Participación de menores',
    titulo: 'Participación de niñas, niños y adolescentes',
    bloques: [
      { tipo: 'p', texto: 'Cuando en los vehículos o carros alegóricos participen niñas, niños o adolescentes, sus padres, representantes legales o adultos responsables deberán adoptar las medidas necesarias para garantizar su seguridad y supervisión.' },
      { tipo: 'p', texto: 'Los menores deberán permanecer bajo el cuidado de personas responsables durante su participación.' },
      { tipo: 'p', texto: 'Los vehículos deberán contar con condiciones adecuadas que eviten caídas, desplazamientos peligrosos o cualquier otra situación que pueda comprometer su integridad.' }
    ]
  },
  {
    id: 'organizacion',
    indice: 'Organización del evento',
    titulo: 'Organización y desarrollo del evento',
    bloques: [
      { tipo: 'p', texto: 'Los participantes deberán respetar los horarios, puntos de concentración, recorridos e instrucciones comunicadas por la organización.' },
      { tipo: 'p', texto: 'Durante el desarrollo del desfile deberán mantener una conducta respetuosa y colaborar con el orden y la seguridad de la celebración.' },
      { tipo: 'p', texto: 'La organización podrá comunicar ajustes relacionados con horarios, recorridos, ubicaciones o disposiciones operativas cuando las circunstancias lo requieran.' },
      { tipo: 'p', texto: 'Estos cambios serán informados mediante los canales de comunicación habilitados, cuando sea posible.' }
    ]
  },
  {
    id: 'responsabilidades',
    indice: 'Responsabilidades',
    titulo: 'Responsabilidades de los participantes',
    bloques: [
      { tipo: 'p', texto: 'Cada participante o responsable del registro deberá:' },
      {
        tipo: 'ul',
        items: [
          'Proporcionar información correcta durante la inscripción.',
          'Verificar las condiciones de seguridad del vehículo.',
          'Cumplir las disposiciones legales de tránsito.',
          'Respetar las instrucciones de los organizadores y autoridades.',
          'Mantener una conducta responsable durante la celebración.',
          'Adoptar las medidas necesarias para proteger a los ocupantes del vehículo y a terceros.'
        ]
      },
      { tipo: 'p', texto: 'Los participantes responderán por sus propias acciones u omisiones conforme a la legislación aplicable.' },
      { tipo: 'p', texto: 'La participación en el evento no exime a conductores, propietarios o responsables de las obligaciones que legalmente les correspondan.' }
    ]
  },
  {
    id: 'incumplimiento',
    indice: 'Incumplimiento',
    titulo: 'Incumplimiento de las condiciones',
    bloques: [
      { tipo: 'p', texto: 'En caso de incumplimiento de las disposiciones establecidas, la organización podrá adoptar medidas proporcionales para preservar la seguridad y el correcto desarrollo del evento.' },
      { tipo: 'p', texto: 'Estas medidas podrán incluir la solicitud de corrección de las condiciones observadas, la revisión del registro o la restricción de participación cuando existan razones justificadas de seguridad u organización.' },
      { tipo: 'p', texto: 'Las decisiones deberán adoptarse de manera razonable, respetando las disposiciones legales aplicables y las competencias de las autoridades correspondientes.' }
    ]
  },
  {
    id: 'modificaciones',
    indice: 'Modificaciones',
    titulo: 'Modificaciones y situaciones extraordinarias',
    bloques: [
      { tipo: 'p', texto: 'Por razones de seguridad, condiciones climáticas, disposiciones de las autoridades competentes u otras circunstancias extraordinarias, el desarrollo del evento podrá estar sujeto a modificaciones.' },
      { tipo: 'p', texto: 'La organización procurará comunicar oportunamente los cambios que afecten a los participantes.' },
      { tipo: 'p', texto: 'Las modificaciones operativas se realizarán procurando preservar la seguridad de los asistentes y el carácter religioso y cultural de la celebración.' }
    ]
  },
  {
    id: 'datos',
    indice: 'Protección de datos',
    titulo: 'Protección de datos personales',
    bloques: [
      { tipo: 'p', texto: 'Los datos personales proporcionados durante la inscripción serán tratados conforme a la Política de Privacidad y Protección de Datos Personales del Monasterio del Carmen de la Asunción.' },
      { tipo: 'p', texto: 'La información será utilizada para gestionar los registros, coordinar la participación y comunicar aspectos relacionados con el evento, de acuerdo con las finalidades y bases legales informadas.' },
      { tipo: 'p', texto: 'El envío de noticias, novedades y futuras convocatorias requerirá una autorización independiente y voluntaria del participante.' },
      { tipo: 'p', texto: 'La aceptación de los presentes Términos y Condiciones no implica automáticamente el consentimiento para recibir comunicaciones futuras.' },
      { tipo: 'p', texto: 'Los participantes podrán consultar la Política de Privacidad para conocer las condiciones del tratamiento de sus datos y los mecanismos para ejercer sus derechos.' }
    ]
  },
  {
    id: 'actualizacion',
    indice: 'Actualización',
    titulo: 'Actualización de los términos y condiciones',
    bloques: [
      { tipo: 'p', texto: 'El Monasterio del Carmen de la Asunción podrá actualizar los presentes Términos y Condiciones cuando resulte necesario por razones organizativas, de seguridad o de cumplimiento normativo.' },
      { tipo: 'p', texto: 'Las modificaciones serán publicadas en la plataforma web.' },
      { tipo: 'p', texto: 'Cuando los cambios afecten sustancialmente las condiciones de participación de personas ya inscritas, se procurará informarles oportunamente y obtener una nueva aceptación cuando legalmente corresponda.' }
    ]
  },
  {
    id: 'contacto',
    indice: 'Contacto',
    titulo: 'Contacto',
    bloques: [
      { tipo: 'p', texto: 'Para consultas relacionadas con el registro y la participación de vehículos y carros alegóricos, los interesados podrán comunicarse mediante los canales institucionales habilitados.' },
      {
        tipo: 'ul',
        items: [
          'Monasterio del Carmen de la Asunción — Cuenca, Ecuador',
          'Correo electrónico: info@monasteriocarmenasuncionocd.com',
          'Teléfono: (07) 2823450'
        ]
      }
    ]
  }
];

export const TERMINOS_DECLARACION = 'Al seleccionar la casilla de aceptación y completar el proceso de inscripción, el participante declara haber leído y aceptado los presentes Términos y Condiciones de Participación, comprometiéndose a cumplir las disposiciones establecidas para contribuir al desarrollo seguro, ordenado y respetuoso del Pase del Niño Viajero.';

export const TERMINOS: DocumentoLegal = {
  titulo: 'Términos y Condiciones de Participación',
  icono: 'pi pi-file',
  actualizacion: TERMINOS_ULTIMA_ACTUALIZACION,
  secciones: TERMINOS_SECCIONES,
  cierre: { titulo: 'Declaración de aceptación', texto: TERMINOS_DECLARACION }
};
