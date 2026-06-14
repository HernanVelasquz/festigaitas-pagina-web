CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  description TEXT NOT NULL,
  issuing_entity TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  file_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_legal_documents" ON legal_documents
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "insert_legal_documents" ON legal_documents
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "update_legal_documents" ON legal_documents
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_legal_documents" ON legal_documents
  FOR DELETE TO authenticated USING (true);

INSERT INTO legal_documents (name, document_type, description, issuing_entity, issue_date, expiry_date, file_url, sort_order) VALUES
(
  'Registro Único Tributario — RUT',
  'rut',
  'Documento expedido por la DIAN que acredita la inscripción del Festival Nacional de Gaitas Francisco Llirene en el Registro Único Tributario. Identifica la organización como entidad sin ánimo de lucro dedicada a la promoción y preservación del patrimonio cultural inmaterial del Caribe colombiano.',
  'Dirección de Impuestos y Aduanas Nacionales — DIAN',
  '2005-03-14',
  NULL,
  NULL,
  1
),
(
  'Certificado de Representación Legal',
  'certificado_representacion',
  'Certificado emitido por la Cámara de Comercio de Sincelejo que acredita al representante legal del Festival Nacional de Gaitas Francisco Llirene para actuar en nombre de la organización, suscribir contratos, convenios y realizar gestiones ante entidades públicas y privadas.',
  'Cámara de Comercio de Sincelejo',
  '2024-01-10',
  '2025-01-10',
  NULL,
  2
),
(
  'Personería Jurídica',
  'personeria_juridica',
  'Reconocimiento de la personalidad jurídica del Festival Nacional de Gaitas Francisco Llirene como asociación cultural sin ánimo de lucro, conforme a la normativa colombiana. Autoriza a la organización a realizar actividades en pro de la cultura gaitera del departamento de Sucre.',
  'Gobernación de Sucre — Secretaría de Cultura',
  '1995-08-07',
  NULL,
  NULL,
  3
),
(
  'Certificado de Existencia y Representación',
  'certificado_existencia',
  'Documento que acredita la existencia legal y vigencia de la organización festival, junto con los datos del representante legal actual y las facultades que le han sido otorgadas por la junta directiva para comprometer a la institución en actos jurídicos.',
  'Cámara de Comercio de Sincelejo',
  '2024-02-20',
  '2025-02-20',
  NULL,
  4
),
(
  'Aval del Ministerio de Cultura',
  'aval_ministerio',
  'Aval oficial otorgado por el Ministerio de Cultura de Colombia que reconoce al Festival Nacional de Gaitas de Ovejas como evento de interés cultural nacional, y que faculta a la organización para gestionar recursos de cofinanciación ante el Gobierno Nacional.',
  'Ministerio de Cultura de Colombia',
  '2019-05-22',
  NULL,
  NULL,
  5
),
(
  'Resolución de Declaratoria — Patrimonio Cultural',
  'declaratoria_patrimonio',
  'Resolución mediante la cual el Ministerio de Cultura de Colombia declara al Festival Nacional de Gaitas Francisco Llirene como Patrimonio Cultural Inmaterial de la Nación, reconociendo su valor histórico, artístico y social para la identidad cultural colombiana.',
  'Ministerio de Cultura de Colombia',
  '2019-08-07',
  NULL,
  NULL,
  6
);
