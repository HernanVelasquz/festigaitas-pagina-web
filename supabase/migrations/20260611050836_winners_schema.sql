CREATE TABLE IF NOT EXISTS winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  position TEXT NOT NULL,
  group_name TEXT NOT NULL,
  origin TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_winners" ON winners FOR SELECT TO anon USING (true);
CREATE POLICY "insert_winners" ON winners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_winners" ON winners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_winners" ON winners FOR DELETE TO authenticated USING (true);

INSERT INTO winners (year, category, category_label, position, group_name, origin, sort_order) VALUES
(2023, 'gaita_larga', 'Gaita Larga', 'Campeón Nacional', 'LOS HEREDEROS DEL MONTE', 'Ovejas, Sucre', 1),
(2023, 'gaita_corta', 'Gaita Corta', 'Primer Puesto', 'SON DE LA SABANA', 'Sincelejo, Sucre', 2),
(2023, 'tradicional', 'Tradicional', 'Mayor Categoría', 'RAMÓN VILLAMEL', 'Sucre, Colombia', 3),
(2023, 'aparte', 'Aparte', 'Revelación', 'NUEVAS SEMILLAS', 'Corozal, Sucre', 4),
(2022, 'gaita_larga', 'Gaita Larga', 'Campeón Nacional', 'GAITEROS DE PUNTA CANOA', 'Bolívar', 1),
(2022, 'gaita_corta', 'Gaita Corta', 'Primer Puesto', 'CONJUNTO SON CARIBE', 'Córdoba', 2),
(2022, 'tradicional', 'Tradicional', 'Mayor Categoría', 'MAESTRO TOÑO FERNÁNDEZ', 'Sucre', 3),
(2022, 'aparte', 'Aparte', 'Revelación', 'VIENTOS DEL CARIBE', 'Atlántico', 4),
(2021, 'gaita_larga', 'Gaita Larga', 'Campeón Nacional', 'ENTRE GAITAS Y TAMBORES', 'Sucre', 1),
(2021, 'gaita_corta', 'Gaita Corta', 'Primer Puesto', 'LOS CAÑAVERALES', 'Bolívar', 2),
(2021, 'tradicional', 'Tradicional', 'Mayor Categoría', 'FAMILIA PACHECO', 'Ovejas, Sucre', 3),
(2021, 'aparte', 'Aparte', 'Revelación', 'SEMILLA GAITERA', 'Sincelejo, Sucre', 4);

CREATE TABLE IF NOT EXISTS moments_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE moments_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_moments" ON moments_gallery FOR SELECT TO anon USING (true);
CREATE POLICY "insert_moments" ON moments_gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_moments" ON moments_gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_moments" ON moments_gallery FOR DELETE TO authenticated USING (true);

INSERT INTO moments_gallery (image_url, alt_text, sort_order) VALUES
('https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800', 'Gaiteros en el escenario principal', 1),
('https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800', 'Conjunto de gaitas tradicionales', 2),
('https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800', 'Público del festival en la plaza', 3),
('https://images.pexels.com/photos/164693/pexels-photo-164693.jpeg?auto=compress&cs=tinysrgb&w=800', 'Noche de gala del festival', 4),
('https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', 'Maestro gaitero en concierto', 5),
('https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=800', 'Percusionistas en la tarima', 6);
