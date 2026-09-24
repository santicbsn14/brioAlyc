// Contenido de las dos páginas legales: /codigo-de-conducta y /terminos-y-condiciones.
//
// CÓDIGO DE CONDUCTA (`codigoConducta`): es el texto REAL de Brio Valores, se reproduce
// completo y sin resumir, respetando capítulos y numeración del documento original. Un
// "bloque" dentro de un capítulo es o bien un párrafo simple, o bien un párrafo que
// introduce una lista (algunos artículos, ej. 4.2/4.4/4.6/4.7, tienen viñetas; 4.4 y 4.6
// además tienen sub-viñetas anidadas, ej. b.1/b.2/b.3 dentro de un ítem de 4.4). No editar
// el contenido de este objeto sin volver a cotejarlo contra el original de Brio.
//
// TÉRMINOS Y CONDICIONES (`terminosCondiciones`):
// TODO(Agus/asesoría legal): este texto es un borrador genérico armado para lanzar el
// sitio, Brio tiene que revisarlo y reemplazarlo por el texto definitivo de su asesoría
// legal antes de darlo por cerrado.

/** Un ítem de lista dentro de un bloque de tipo "lista". `sub` son sub-viñetas anidadas
 * (ej. los incisos b.1/b.2/b.3 de un ítem de 4.4), opcionales. */
export interface LegalListItem {
  texto: string;
  sub?: string[];
}

/** Un bloque de contenido dentro de un capítulo: párrafo simple, o párrafo + lista. */
export type LegalBloque =
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'lista'; intro: string; items: LegalListItem[] };

export interface LegalCapitulo {
  id: string;
  /** Título completo tal cual el original, con su número (ej. "Capitulo I: Introducción"). */
  titulo: string;
  bloques: LegalBloque[];
}

export interface CodigoConductaContent {
  empresa: string;
  titulo: string;
  prefacioTitulo: string;
  prefacio: string;
  capitulos: LegalCapitulo[];
  cierre: string;
  firmante: string;
  firmanteCargo: string;
  firmanteEmpresa: string;
}

export const codigoConducta: CodigoConductaContent = {
  empresa: 'Brio Valores Agente de Liquidación y Compensación S.A.',
  titulo: 'Código de conducta',
  prefacioTitulo: 'Prefacio',
  prefacio:
    'El presente CODIGO DE CONDUCTA (en adelante, «Código») ha sido confeccionado de conformidad a lo dispuesto de las NORMAS CNV (N.T. 2013), cuya implementación se hace con la intención de establecer un marco de referencia que contribuya a unificar criterios de conducta internos que permitan optimizar las prácticas bursátiles con una mayor transparencia y generar lazos mas estrechos con el público inversor.',
  capitulos: [
    {
      id: 'cap-1',
      titulo: 'Capitulo I: Introducción',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            '1.1. Personas Sujetas: El presente Código es de aplicación a los miembros de los órganos de administración y fiscalización y a todos los empleados de la organización en el cumplimiento de sus funciones.',
        },
        {
          tipo: 'parrafo',
          texto:
            '1.2. Conocimiento y aplicación del Código: Todas las personas sujetas tienen la obligación de conocer el contenido del presente Código y sus actualizaciones, dar cumplimiento efectivo del mismo y colaborar con su aplicación.',
        },
        {
          tipo: 'parrafo',
          texto:
            '1.3. Vigencia: Las normas expuestas en el presente Código tendrán vigencia a partir del día 01 de Julio de 2014 o en su defecto, cuando el regulador disponga la autorización para actuar a esta sociedad en el ámbito de Ley 26.831.',
        },
      ],
    },
    {
      id: 'cap-2',
      titulo: 'Capitulo II: Normas e Instructivos para la apertura de cuentas',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            '2.1. En el acto de apertura de cuentas hará saber al comitente que se encuentra facultado a operar con cualquier intermediario inscripto en los registros de CNV, cuyo listado se encuentra a disposición en la página www.cnv.gob.ar y que la elección del mismo, corre por su cuenta y responsabilidad.',
        },
        {
          tipo: 'parrafo',
          texto:
            '2.2. El comitente tendrá derecho a retirar los saldos a favor en sus cuentas en cualquier momento como así también solicitar el cierre de la misma. El Agente podrá unilateralmente decidir el cierre de su cuenta, debiendo en este caso, notificar al comitente con una antelación de 72 horas. En cualquier caso, el cierre de la cuenta, implica liquidar las operaciones pendientes y cancelar todas sus obligaciones y entregar el saldo, en caso que lo hubiera a su titular.',
        },
        {
          tipo: 'parrafo',
          texto:
            '2.3. El Agente podrá ante cualquier incumplimiento por parte del comitente, disponer el cierre de la cuenta, debiendo liquidar las operaciones pendientes y entregar el saldo, en caso que lo hubiera, al titular o cualquier cotitular de la cuenta. La decisión de cierre de cuenta deberá ser notificada al comitente dentro de las 48 horas de llevarse a cabo el cierre de la misma.',
        },
        {
          tipo: 'parrafo',
          texto:
            '2.4. El Agente previo a la apertura de una cuenta comitente, exigirá al inversor copia del Documento Nacional de Identidad y/o Pasaporte en caso de extranjeros, a los fines de su agregación al legajo correspondiente, además del cumplimiento de las normas de apertura de cuenta según lo establecido en la normativa vigente y de la Unidad de Información Financiera (UIF – Ley Nº 25.246).',
        },
        {
          tipo: 'parrafo',
          texto:
            '2.5. La apertura de una cuenta comitente implica autorizar al Agente a operar por cuenta y orden del mismo. En este caso, el comitente acepta que las órdenes podrán ser en forma personal o a través de los diferentes medios de comunicación autorizados por la normativa vigente. En caso de sólo aceptar las órdenes verbales, el comitente deberá comunicar al intermediario.',
        },
        {
          tipo: 'parrafo',
          texto:
            '2.6. En las autorizaciones que los comitentes efectúen a terceros, se deberá especificar en forma clara y detallada el alcance, límites y acciones otorgadas al autorizado.',
        },
        {
          tipo: 'parrafo',
          texto:
            '2.7. El Agente deberá tener a la vista del público una tabla de aranceles, derechos de mercado y demás gastos que demanden la apertura de cuentas, depósitos de valores negociables en Agentes de Custodia y Registro y operaciones realizadas, o en su caso una nota que contenga dicha información. En éste último caso se deberá dejar constancia de su recepción. Misma información deberá encontrarse publicada en la pagina Web del Agente y de la CNV.',
        },
        {
          tipo: 'parrafo',
          texto:
            '2.8. Por cada una de las operaciones realizadas, el Agente deberá entregar al comitente un boleto que cumpla con las exigencias de la reglamentación vigente.',
        },
        {
          tipo: 'parrafo',
          texto:
            '2.9. Por cada uno de los ingresos y egresos de dinero y/o valores negociables efectuados, el Agente deberá extender los comprobantes de respaldo correspondientes.',
        },
      ],
    },
    {
      id: 'cap-3',
      titulo: 'Capitulo III: Normas e Instructivos para la apertura de cuentas',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            '3.1. Las personas sujetas que se mencionan en el punto 1.1 del presente Código, tienen como obligación:',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.2. Observar la conducta y decoro que se consideran propios de un buen hombre de negocios para con las autoridades y funcionarios del Organismo de Contralor y del Mercado en el que actúen.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.3. Actuar para con el comitente de manera leal y transparente, en todo lo referente a las diferentes operaciones ofrecidas, de acuerdo con las disposiciones legales y reglamentarias vigentes.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.4. Informar al comitente de manera clara y precisa acerca de aquellas operaciones que el Agente pueda concertar, suministrando al comitente conocimientos necesarios al momento de la toma de decisión.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.5. Otorgarle al comitente información relacionada con las operaciones que se concertarán por cuenta y orden de los mismos. Dicha información, deberá contener datos certeros acerca de plazos, modos, tiempo de concertación, vencimiento.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.6. Guardar reserva y confidencialidad de toda información relativa a cada uno de sus comitentes, en los términos del art. 53 de la Ley Nº 26.831. Quedarán relevados de esta obligación por decisión judicial dictada en cuestiones de familia y en procesos criminales vinculados a esas operaciones o a terceros relacionados con ellas, así como también cuando les sean requeridas por la Comisión Nacional de Valores, el Banco Central de la República Argentina, la Unidad de Información Financiera y la Superintendencia de Seguros de la Nación en el marco de investigaciones propias de sus funciones.',
        },
        {
          tipo: 'parrafo',
          texto: '3.7. Las personas sujetas ejecutarán con celeridad las órdenes recibidas de los comitentes.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.8. Las personas sujetas no antepondrán operaciones para cartera propia cuando tengan pendiente de concertación órdenes de clientes en las mismas condiciones.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.9. Las personas sujetas deberán guardar confidencialidad sobre la información sensible a la que tengan acceso con el uso de sus funciones. Esta obligación seguirá vigente aún después del cese de su vinculación con la organización.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.10. El Agente se abstendrá de multiplicar transacciones en forma innecesaria y sin beneficio para los comitentes.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.11. En caso de conflictos de intereses entre clientes, el Agente deberá evitar privilegiar a cualquiera de ellos. Cuando se trate de la cartera propia deberán salvaguardar el interés del comitente.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.12. El Agente pondrá en practica medidas que permitan un adecuado control del acceso a la información sensible, como así también a la documentación u otros soportes en que la misma este contenida.',
        },
        {
          tipo: 'parrafo',
          texto:
            '3.13. Las personas sujetas se abstendrán de realizar prácticas que falseen la libre formación de precios o provoquen una evolución artificial de las cotizaciones.',
        },
      ],
    },
    {
      id: 'cap-4',
      titulo: 'Capítulo IV: Actuación con clientes',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            '4.1. El Agente sitúa a los clientes como centro de su actividad, al objeto de establecer relaciones duraderas con ellos basadas en la recíproca aportación de valor y en la mutua confianza, mediante el asesoramiento profesionalizado y la innovación en la configuración y prestación eficiente de productos y servicios adaptados a las necesidades de los mismos, en un marco de mejora continua en la atención y disponibilidad de los servicios.',
        },
        {
          tipo: 'lista',
          intro:
            '4.2. A tal fin, el Agente, en lo concerniente a sus inversores y con particular énfasis en el pequeño inversor minorista no profesional, respetará las normas de protección al inversor para lo cual se compromete a:',
          items: [
            { texto: 'Realizar las operaciones convenidas, respetando la tolerancia al riesgo indicada por el cliente al Agente.' },
            {
              texto:
                'Consultar al cliente, dejando constancia en modo fehaciente de las operaciones por realizar que difieran de las estipuladas en el convenio de autorización.',
            },
            { texto: 'Poner a disposición la información y documentación de las transacciones realizadas en tiempo y forma.' },
            {
              texto:
                'Solicitarle indicaciones respecto a las inversiones habilitadas con los saldos líquidos al final del día, y en su caso número de cuenta a donde realizar las transferencias de los mismos y de las acreencias depositadas en su subcuenta comitente abierta en el Agente. De no mediar una instrucción precisa sobre los saldos disponibles los mismos quedarán a disposición del cliente.',
            },
            {
              texto:
                'Informar al cliente de cada uno de los costos (generales y/o excepcionales) a cargo del cliente involucrado en las distintas operaciones, incluyendo aclaración en cada caso respecto si se trata de datos anuales, si son de carácter fijo y/o variable, y la fecha de vigencia indicando dónde puede el cliente adquirir datos actualizados de estos conceptos.',
            },
            { texto: 'Priorizar el interés de los comitentes terceros por sobre los comprendidos en el grupo de cartera propia.' },
            {
              texto:
                'Comunicar inmediatamente a la CNV aquellas vinculaciones económicas, familiares o de cualquier otra naturaleza respecto de terceros que, en su actuación pudiera suscitar conflicto de intereses con sus clientes.',
            },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            '4.3. El personal del Agente declara conocer y desterrar las conductas contrarias a la transparencia en el ámbito de la oferta pública, las cuales se refieren al abuso de información privilegiada, a la manipulación y engaño del mercado y a la prohibición de intervenir u ofrecer en la oferta pública en forma no autorizada.',
        },
        {
          tipo: 'lista',
          intro: '4.4. En consecuencia el personal del Agente en lo concerniente a la información privilegiada, no podrá:',
          items: [
            {
              texto:
                'Utilizar la información reservada allí referida a fin de obtener para sí o para otros, ventajas de cualquier tipo, deriven ellas de la compra o venta de valores negociables, o de cualquier otra operación relacionada con el régimen de la oferta pública.',
            },
            {
              texto: 'Realizar por cuenta propia o ajena, directa o indirectamente, las siguientes acciones:',
              sub: [
                'b.1) Preparar, facilitar, tener participación o realizar cualquier tipo de operación en el mercado, sobre los valores negociables a que la información se refiera.',
                'b.2) Comunicar dicha información a terceros, salvo en el ejercicio normal de su trabajo, profesión, cargo o función.',
                'b.3) Recomendar a un tercero que adquiera o ceda valores negociables o que haga que otros los adquieran o cedan, basándose en dicha información.',
              ],
            },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            '4.5. En caso de incurrir en las conductas descriptas, el diferencial de precio positivo obtenido por quienes hubieren hecho uso indebido de información privilegiada proveniente de cualquier operación efectuada dentro de un período de SEIS (6) meses, respecto de cualquier valor negociable de los emisores a que se hallaren vinculados, corresponderá al emisor y será recuperable por él, sin perjuicio de las sanciones que pudieren corresponder al infractor. Si el emisor omitiera incoar la acción correspondiente o no lo hiciera dentro de los SESENTA (60) días de ser intimado a ello, o no lo impulsara diligentemente después de la intimación, dichos actos podrán ser realizados por cualquier accionista.',
        },
        {
          tipo: 'lista',
          intro: '4.6. Respecto de la manipulación y engaño del mercado deberán:',
          items: [
            {
              texto:
                'Abstenerse de realizar prácticas o conductas que pretendan o permitan la manipulación de precios o volúmenes de los valores negociables listados en Mercados.',
            },
            {
              texto:
                'Abstenerse de incurrir en prácticas o conductas engañosas que puedan inducir a error a cualquier participante en dichos mercados, en relación con la compra o venta de cualquier valor negociable en la oferta pública.',
            },
            {
              texto:
                'Las conductas anteriores incluyen, pero no se limitan a, cualquier acto, práctica o curso de acción mediante los cuales se pretenda afectar artificialmente la formación de precios, liquidez o el volumen negociado de uno o más valores negociables. Ello incluye:',
              sub: [
                'c.1) Transacciones en las que no se produzca, más allá de su apariencia, la transferencia de los valores negociables.',
                'c.2) Transacciones efectuadas con el propósito de crear la apariencia falsa de existencia de oferta y demanda o de un mercado activo, aún cuando se produzca efectivamente la transferencia de los valores negociables.',
              ],
            },
            {
              texto: 'Inducir a error a cualquier interviniente en el mercado. Ello incluye:',
              sub: [
                'd.1) Toda declaración falsa producida con conocimiento de su carácter inexacto o engañoso o que razonablemente debiera ser considerada como tal.',
                'd.2) Toda omisión de información esencial susceptible de inducir a error por quienes se encuentran obligados a prestarla.',
              ],
            },
          ],
        },
        {
          tipo: 'lista',
          intro:
            '4.7. En cuanto a la prohibición de intervenir u ofrecer en la oferta pública en forma no autorizada, deberán especialmente abstenerse de:',
          items: [
            { texto: 'Intervenir en la oferta pública en cualquier calidad que requiera autorización previa, sin contar con ella.' },
            {
              texto:
                'Ofrecer, comprar, vender o realizar cualquier tipo de operación sobre valores negociables que por sus características debieran contar con autorización de oferta pública y no la hubieran obtenido al momento de la operación.',
            },
            { texto: 'Realizar operaciones no autorizadas expresamente por la Comisión.' },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            '4.8. El incumplimiento de las obligaciones impuestas respecto de las conductas contrarias a la transparencia en el ámbito de la oferta pública, serán objeto de investigación y eventual sanción por parte de la Comisión Nacional de Valores.',
        },
        {
          tipo: 'parrafo',
          texto:
            '4.9. El Agente espera de sus clientes un comportamiento y una gestión de sus actividades económicas ajustadas a la legalidad y solicita su colaboración para cumplir eficazmente con el objetivo institucional y compromiso social de prevenir el lavado de dinero y la financiación de actividades terroristas.',
        },
        {
          tipo: 'parrafo',
          texto:
            '4.10. Asimismo el Agente, se compromete a proteger debidamente su información, limitando su uso a lo previsto en las disposiciones legales que resulten de aplicación. La información no pública que se disponga de clientes y sus operaciones, tiene carácter confidencial y como tal será tratada y cuidada. Garantizar la seguridad de acceso a sus sistemas informáticos y a los archivos físicos en los que se almacena documentación contractual y transaccional de sus clientes.',
        },
        {
          tipo: 'parrafo',
          texto:
            '4.11. Los empleados, que por razón de su cargo o de su actividad profesional, dispongan o tengan acceso a información de clientes, son responsables de su custodia y apropiado uso, en un todo de acuerdo con lo indicado en el Título VII, Capítulo III, Artículo I de las normas 2013 de la Comisión Nacional de Valores.',
        },
        {
          tipo: 'parrafo',
          texto:
            '4.12. El Agente adquiere el compromiso de facilitar a sus clientes información oportuna, precisa y comprensible sobre sus operaciones, así como información clara y veraz sobre las características de los servicios, arbitrando los medios para que los clientes dispongan de las vías necesarias para presentar por modo formal sus quejas vinculadas con la calidad de atención, para ser respondidas por el mismo canal dentro de los plazos normativos previstos.',
        },
      ],
    },
    {
      id: 'cap-5',
      titulo: 'Capítulo V: Prevención del Lavado de Dinero y Financiación del Terrorismo',
      bloques: [
        {
          tipo: 'parrafo',
          texto: '5.1. Las personas sujetas deberán observar una especial diligencia en el cumplimiento de las siguientes normas:',
        },
        {
          tipo: 'parrafo',
          texto:
            '5.2. Poseer un adecuado conocimiento del cliente, confirmando y documentando la identidad de los mismos, así como cualquier información adicional, conforme lo dispuesto por el art. 21 de la Ley Nº 25.246.',
        },
        {
          tipo: 'parrafo',
          texto:
            '5.3. Cuando los clientes, requirentes o aportantes actúen en representación de terceros, se deberán tomar los recaudos necesarios a efectos de corroborar la identidad de la persona por quienes actúen.',
        },
        {
          tipo: 'parrafo',
          texto:
            '5.4. Toda información deberá archivarse por el término establecido en las normas vigentes y según las formas que establezca la Unidad de Información Financiera.',
        },
        {
          tipo: 'parrafo',
          texto:
            '5.5. Abstenerse de revelar al comitente o a terceros las actuaciones que se estén realizando en cumplimiento de la Ley Nº 25.246.',
        },
        {
          tipo: 'parrafo',
          texto:
            '5.6. No aceptar comitentes que se encuentren constituidos en Estados o Jurisdicciones establecidas en el Decreto Nº 1344/98 «Listado de Paraísos Fiscales».',
        },
      ],
    },
  ],
  cierre:
    'El presente Código deberá ser exhibido en la Página Web del Agente tanto para conocimiento de los clientes como para las personas sujetas.',
  firmante: 'Carlos Alberto Rodríguez Ansaldi',
  firmanteCargo: 'Presidente del Directorio',
  firmanteEmpresa: 'Brio Valores Agente de Liquidación y Compensación S.A.',
};

export interface TerminosSeccion {
  numero: number;
  titulo: string;
  texto: string;
}

export interface TerminosCondicionesContent {
  titulo: string;
  secciones: TerminosSeccion[];
  cierre: string;
}

// TODO(Agus/asesoría legal): este texto es un borrador genérico armado para lanzar el
// sitio, Brio tiene que revisarlo y reemplazarlo por el texto definitivo de su asesoría
// legal antes de darlo por cerrado.
export const terminosCondiciones: TerminosCondicionesContent = {
  titulo: 'Términos y Condiciones de Uso',
  secciones: [
    {
      numero: 1,
      titulo: 'Aceptación de los términos',
      texto:
        'El acceso y uso de este sitio web implica la aceptación plena de los presentes Términos y Condiciones. Si no está de acuerdo con ellos, le pedimos que no utilice este sitio.',
    },
    {
      numero: 2,
      titulo: 'Objeto del sitio',
      texto:
        'Este sitio web tiene como finalidad brindar información institucional sobre Brio Valores Agente de Liquidación y Compensación S.A. (en adelante, "Brio Valores"), sus servicios y productos. La información publicada tiene carácter general e informativo y no constituye, en ningún caso, asesoramiento financiero, recomendación de inversión, oferta ni invitación a suscribir, comprar o vender instrumentos financieros.',
    },
    {
      numero: 3,
      titulo: 'Sobre la información publicada',
      texto:
        'Brio Valores procura que la información contenida en el sitio sea exacta y esté actualizada, pero no garantiza su exactitud, integridad o vigencia permanente. Los datos de mercado exhibidos (cotizaciones, tasas, precios) pueden ser referenciales y no reflejar necesariamente valores en tiempo real, según se indique en cada sección. Antes de tomar cualquier decisión de inversión, se recomienda al usuario consultar con un profesional matriculado y evaluar su propia situación patrimonial y tolerancia al riesgo.',
    },
    {
      numero: 4,
      titulo: 'Propiedad intelectual',
      texto:
        'Los contenidos de este sitio —textos, imágenes, logotipos, diseño y estructura— son propiedad de Brio Valores o de terceros que han autorizado su uso, y están protegidos por las leyes de propiedad intelectual vigentes. Queda prohibida su reproducción total o parcial sin autorización previa y por escrito.',
    },
    {
      numero: 5,
      titulo: 'Uso del sitio',
      texto:
        'El usuario se compromete a utilizar el sitio de conformidad con la ley, la moral, el orden público y los presentes Términos, absteniéndose de utilizarlo con fines ilícitos o lesivos, o de cualquier forma que pueda dañar, inutilizar o sobrecargar el sitio o impedir su normal funcionamiento.',
    },
    {
      numero: 6,
      titulo: 'Enlaces a sitios de terceros',
      texto:
        'Este sitio puede contener enlaces a sitios web de terceros (por ejemplo, plataformas de operación, portales de mercado o redes sociales). Brio Valores no se responsabiliza por el contenido, políticas de privacidad o prácticas de dichos sitios, que quedan fuera de su control.',
    },
    {
      numero: 7,
      titulo: 'Formulario de contacto',
      texto:
        'Los datos ingresados a través del formulario de contacto se utilizan exclusivamente para responder a la consulta realizada. Para más información sobre el tratamiento de datos personales, consulte nuestra Política de Privacidad (a publicar).',
    },
    {
      numero: 8,
      titulo: 'Limitación de responsabilidad',
      texto:
        'Brio Valores no será responsable por daños o perjuicios derivados de la imposibilidad de acceso al sitio, errores u omisiones en los contenidos, o del uso que el usuario haga de la información publicada.',
    },
    {
      numero: 9,
      titulo: 'Modificaciones',
      texto:
        'Brio Valores podrá modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en este sitio.',
    },
    {
      numero: 10,
      titulo: 'Ley aplicable y jurisdicción',
      texto:
        'Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Para cualquier controversia derivada de su interpretación o cumplimiento, las partes se someten a la jurisdicción de los tribunales ordinarios competentes.',
    },
  ],
  cierre: 'Brio Valores Agente de Liquidación y Compensación S.A. — Agente CNV Mat. 512 — Rosario, Santa Fe, Argentina.',
};
