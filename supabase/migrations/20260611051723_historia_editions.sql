CREATE TABLE IF NOT EXISTS historia_editions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE historia_editions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_historia" ON historia_editions FOR SELECT TO anon USING (true);
CREATE POLICY "insert_historia" ON historia_editions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_historia" ON historia_editions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_historia" ON historia_editions FOR DELETE TO authenticated USING (true);

INSERT INTO historia_editions (year, title, description, image_url, sort_order) VALUES
(2023, 'Edición 39 — El Reencuentro', 'La edición 39 marcó el regreso pleno del festival tras años de adaptaciones. Más de 18.000 asistentes llenaron las plazas y callejones de Ovejas en una celebración que desbordó expectativas. Se presentaron 32 agrupaciones de doce departamentos del país, con una participación inédita de grupos juveniles que demostraron la vitalidad de la tradición gaitera. El concurso principal se desarrolló en la renovada tarima de la Plaza Francisco Llirene con transmisión en vivo a nivel nacional. La ciudad entera se convirtió en escenario: cada esquina resonó con gaitas, tambores y voces que recordaban por qué Ovejas es la capital gaitera de Colombia.', 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200', 1),
(2022, 'Edición 38 — La Vuelta', 'El festival de 2022 fue un acto de resiliencia cultural. Después de dos años de restricciones, la gaita volvió a sonar con toda su fuerza en las calles de Ovejas. La edición contó con homenajes especiales a los maestros gaiteros que fallecieron durante la pandemia, convirtiendo cada presentación en un acto de memoria colectiva. Se realizó por primera vez un ciclo de talleres abiertos al público general donde los maestros compartieron técnicas de fabricación y ejecución de la gaita tradicional. La asistencia superó las 14.000 personas durante los tres días del evento.', 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=1200', 2),
(2021, 'Edición 37 — Formato Híbrido', 'La edición 2021 fue un experimento sin precedentes: el festival se realizó en formato híbrido con transmisiones en vivo para audiencias virtuales alrededor del mundo y un aforo presencial reducido. Fue la primera vez que el Festival de Gaitas llegó simultáneamente a más de 40 países a través de plataformas digitales. A pesar de las limitaciones, 28 agrupaciones participaron manteniendo la competencia oficial. Esta edición demostró que la gaita trasciende fronteras físicas y que la identidad cultural sucreña tiene resonancia global.', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200', 3),
(2020, 'Edición 36 — Pausa Forzada', 'El año 2020 impuso una pausa histórica al festival. Sin embargo, la comunidad gaitera de Ovejas respondió con una serie de encuentros virtuales, documentales en vivo y espacios de memoria que mantuvieron viva la llama de la tradición. Se publicó el archivo digital más completo de la historia del festival, con registros de audio y video desde 1984 hasta 2019. La "Gaita en Cuarentena" se convirtió en un movimiento espontáneo en redes sociales que reunió a miles de músicos tocando desde sus hogares.', 'https://images.pexels.com/photos/1389306/pexels-photo-1389306.jpeg?auto=compress&cs=tinysrgb&w=1200', 4),
(2019, 'Edición 35 — Bodas de Rubi', 'El trigésimo quinto aniversario fue una celebración excepcional. Se reunieron en Ovejas las agrupaciones ganadoras de todas las ediciones anteriores del festival en un concierto antológico que duró más de seis horas. La plaza se llenó con cerca de 22.000 personas, la mayor asistencia registrada hasta ese momento. El Ministerio de Cultura de Colombia declaró al Festival Nacional de Gaitas como Patrimonio Cultural Inmaterial de la Nación. Se estrenó el documental "La Caña y el Alma" sobre la historia del instrumento y el festival, exhibido posteriormente en festivales internacionales de cine.', 'https://images.pexels.com/photos/1105663/pexels-photo-1105663.jpeg?auto=compress&cs=tinysrgb&w=1200', 5),
(2018, 'Edición 34 — Internacionalización', 'La edición 34 marcó un hito en la proyección internacional del festival. Por primera vez participaron agrupaciones de Venezuela, Ecuador y Panamá, enriqueciendo el diálogo musical caribeño. Se inauguró la sección "Gaita Experimental", un espacio para propuestas que fusionan la gaita con otros géneros sin perder su esencia. El concurso de fotografía "Ojo Gaitero" convocó a artistas visuales de todo el continente que documentaron el festival con sus lentes. La ciudad de Ovejas recibió reconocimiento internacional como "Ciudad de la Gaita".', 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1200', 6),
(1984, 'Edición 1 — El Primer Soplo', 'El primer Festival de Gaitas nació de un sueño compartido por un grupo de músicos, artesanos e intelectuales de Ovejas que veían cómo la gaita, instrumento milenario de los pueblos indígenas del Caribe, comenzaba a desvanecerse frente al empuje de la música comercial. Bajo el liderazgo del maestro Francisco Llirene —cuyo nombre llevaría el festival— se convocó a las pocas agrupaciones que aún mantenían viva la tradición. Ese primer encuentro, modesto en recursos pero inmenso en espíritu, plantó la semilla de lo que hoy es el evento cultural más importante del departamento de Sucre.', 'https://images.pexels.com/photos/167483/pexels-photo-167483.jpeg?auto=compress&cs=tinysrgb&w=1200', 7);

-- Add missing winners for 2019 and 2018
INSERT INTO winners (year, category, category_label, position, group_name, origin, sort_order) VALUES
(2019, 'gaita_larga', 'Gaita Larga', 'Campeón Nacional', 'CONJUNTO GAITEROS DEL MAR', 'Barranquilla, Atlántico', 1),
(2019, 'gaita_corta', 'Gaita Corta', 'Primer Puesto', 'LOS TAMBORES DE SAN JACINTO', 'Bolívar', 2),
(2019, 'tradicional', 'Tradicional', 'Mayor Categoría', 'MAESTRO CLÍMACO SARMIENTO', 'Ovejas, Sucre', 3),
(2019, 'aparte', 'Aparte', 'Revelación', 'RAÍCES CARIBEÑAS', 'Sincelejo, Sucre', 4),
(2018, 'gaita_larga', 'Gaita Larga', 'Campeón Nacional', 'SEXTETO GAITERO DEL MONTE', 'Sucre', 1),
(2018, 'gaita_corta', 'Gaita Corta', 'Primer Puesto', 'FAMILIA SOTO PALLARES', 'Ovejas, Sucre', 2),
(2018, 'tradicional', 'Tradicional', 'Mayor Categoría', 'MAESTRO PEDRO GUERRA', 'Córdoba', 3),
(2018, 'aparte', 'Aparte', 'Revelación', 'NUEVA GENERACIÓN GAITERA', 'Atlántico', 4);
