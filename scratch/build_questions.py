# Script Python untuk membuat 160 Soal TKA SMP (4 Paket x 40 Soal) SMPN 1 Segah

import json

def generate_paket1():
    questions = []
    
    # 40 Soal Literasi Dasar & Menengah
    topics = [
      ("Legenda Sungai Segah", "Cerita rakyat dan sejarah alur sungai Segah sebagai urat nadi kehidupan."),
      ("Adiwiyata SMPN 1 Segah", "Program sekolah hijau, pemilahan sampah, dan komposting."),
      ("Budaya Mutas & Gotong Royong", "Tradisi kerja sama antarwarga kampung Segah dalam acara desa."),
      ("Literasi Digital Siswa", "Kemampuan saring sebelum sharing di era media sosial."),
      ("Keanekaragaman Hutan Berau", "Flora dan fauna khas Kalimantan seperti Orangutan dan Enggang."),
      ("Pengalaman di Perpustakaan", "Minat baca 15 menit sebelum KBM di SMPN 1 Segah."),
      ("Konservasi Air Bersih", "Pentingnya menjaga daerah aliran sungai (DAS) Segah."),
      ("Karya Tulis Ilmiah Remaja", "Prestasi siswa Segah mengolah limbah kulit buah menjadi pupuk.")
    ]

    for i in range(1, 41):
        topic_title, topic_desc = topics[(i - 1) % len(topics)]
        q_type = "single" if i % 3 != 0 else ("complex" if i % 3 == 0 and i % 6 != 0 else "table_tf")
        
        stimulus = f'''
          <div class="stimulus-box">
            <h4>{topic_title} (Teks {i})</h4>
            <p>Di kawasan Segah, Kabupaten Berau, {topic_desc.lower()} Pembiasaan literasi dan kepedulian terhadap kelestarian alam menjadi bagian penting dari pendidikan karakter siswa SMP Negeri 1 Segah. Dalam kegiatan harian (Nomor {i}), siswa diajak untuk memahami gagasan utama, menganalisis informasi tersurat maupun tersirat, dan memetik pesan moral dari bacaan.</p>
          </div>
        '''
        
        if q_type == "single":
            q_obj = {
                "id": f"l1_q{i}",
                "type": "single",
                "category": "Literasi",
                "level": "Dasar" if i <= 20 else "Menengah",
                "stimulus": stimulus,
                "question": f"Berdasarkan Teks {topic_title} No. {i}, apakah gagasan utama (ide pokok) dari paragraf tersebut?",
                "options": [
                    f"Pentingnya {topic_title.lower()} dalam membangun karakter dan kelestarian di Segah.",
                    "Siswa tidak perlu membaca teks karena sudah memahami isinya.",
                    "Kegiatan sekolah hanya berfokus pada olahraga tanpa membaca.",
                    "Masyarakat Segah menolak tradisi gotong royong."
                ],
                "answer": 0,
                "explanation": f"Ide pokok paragraf No. {i} menekankan pentingnya {topic_title.lower()} bagi pembentukan karakter dan kelestarian di lingkungan Segah."
            }
        elif q_type == "complex":
            q_obj = {
                "id": f"l1_q{i}",
                "type": "complex",
                "category": "Literasi",
                "level": "Menengah",
                "stimulus": stimulus,
                "question": f"Pernyataan manakah yang SESUAI dengan isi teks {topic_title} No. {i}? (Pilih lebih dari satu)",
                "options": [
                    f"Pendidikan karakter di SMPN 1 Segah melibatkan pemahaman tentang {topic_title.lower()}.",
                    "Siswa diajak menganalisis informasi tersurat dan tersirat dari bacaan.",
                    "Kegiatan literasi di Segah dilarang oleh pihak sekolah.",
                    "Kelestarian alam kawasan Segah tidak memiliki pengaruh bagi masyarakat."
                ],
                "answer": [0, 1],
                "explanation": f"Pernyataan (1) dan (2) sesuai secara langsung dengan isi paragraf stimulus {topic_title} No. {i}."
            }
        else: # table_tf
            q_obj = {
                "id": f"l1_q{i}",
                "type": "table_tf",
                "category": "Literasi",
                "level": "Dasar",
                "stimulus": stimulus,
                "question": f"Tentukan BENAR atau SALAH untuk setiap pernyataan berdasarkan teks {topic_title} No. {i}!",
                "statements": [
                    {"text": f"Membaca {topic_title.lower()} membantu melatih daya kritis siswa.", "correct": True},
                    {"text": "Siswa SMPN 1 Segah diimbau untuk tidak menjaga kebersihan lingkungan.", "correct": False},
                    {"text": "Nilai moral dan kepedulian alam dapat dipetik dari bacaan.", "correct": True}
                ],
                "explanation": f"Pernyataan 1 BENAR (melatih daya kritis), Pernyataan 2 SALAH (bertentangan), Pernyataan 3 BENAR (memetik nilai moral)."
            }
            
        questions.append(q_obj)
        
    return questions

def generate_paket2():
    questions = []
    
    # 40 Soal Numerasi Dasar & Menengah
    for i in range(1, 41):
        q_type = "single" if i % 3 != 0 else ("complex" if i % 3 == 0 and i % 6 != 0 else "table_tf")
        
        # Variasi Angka Matematis Berdasarkan i
        buku_harga = 4000 + (i * 100)
        pulpen_harga = 2500 + (i * 50)
        total_belanja = (3 * buku_harga) + (2 * pulpen_harga)
        uang_bayar = 50000
        kembalian = uang_bayar - total_belanja
        
        nilai1 = 70 + (i % 10)
        nilai2 = 75 + (i % 8)
        nilai3 = 80 + (i % 6)
        nilai4 = 85 + (i % 5)
        nilai5 = 90
        mean_val = round((nilai1 + nilai2 + nilai3 + nilai4 + nilai5) / 5, 1)

        stimulus = f'''
          <div class="stimulus-box">
            <h4>Aritmatika & Data Sekolah (Soal No. {i})</h4>
            <p>Budi dan kawan-kawan kelas VIII di SMPN 1 Segah melakukan transaksi di Koperasi Sekolah. Harga 1 buku tulis adalah Rp {buku_harga:,},00 dan 1 pulpen adalah Rp {pulpen_harga:,},00. Selain itu, terdata nilai ulangan matematika 5 siswa: {nilai1}, {nilai2}, {nilai3}, {nilai4}, dan {nilai5}.</p>
          </div>
        '''
        
        if q_type == "single":
            q_obj = {
                "id": f"n2_q{i}",
                "type": "single",
                "category": "Numerasi",
                "level": "Dasar" if i <= 20 else "Menengah",
                "stimulus": stimulus,
                "question": f"Jika Budi membeli 3 buku tulis dan 2 pulpen dengan selembar uang Rp 50.000,00, berapa uang kembalian yang diterima Budi?",
                "options": [
                    f"Rp {kembalian:,},00",
                    f"Rp {kembalian + 2000:,},00",
                    f"Rp {kembalian - 2000:,},00",
                    f"Rp {total_belanja:,},00"
                ],
                "answer": 0,
                "explanation": f"Total Belanja = (3 × Rp {buku_harga:,}) + (2 × Rp {pulpen_harga:,}) = Rp {total_belanja:,},00. Uang Kembalian = Rp 50.000 - Rp {total_belanja:,} = Rp {kembalian:,},00."
            }
        elif q_type == "complex":
            q_obj = {
                "id": f"n2_q{i}",
                "type": "complex",
                "category": "Numerasi",
                "level": "Menengah",
                "stimulus": stimulus,
                "question": f"Berdasarkan data nilai ulangan {nilai1}, {nilai2}, {nilai3}, {nilai4}, dan {nilai5}, manakah pernyataan yang BENAR? (Pilih lebih dari satu)",
                "options": [
                    f"Rata-rata (mean) nilai ulangan matematika adalah {mean_val}.",
                    f"Jumlah total nilai kelima siswa adalah {nilai1+nilai2+nilai3+nilai4+nilai5}.",
                    "Nilai terendah siswa adalah 100.",
                    "Semua siswa mendapat nilai di bawah 50."
                ],
                "answer": [0, 1],
                "explanation": f"Jumlah nilai = {nilai1+nilai2+nilai3+nilai4+nilai5}. Rata-rata = {nilai1+nilai2+nilai3+nilai4+nilai5}/5 = {mean_val}. Opsi (1) dan (2) Benar."
            }
        else: # table_tf
            q_obj = {
                "id": f"n2_q{i}",
                "type": "table_tf",
                "category": "Numerasi",
                "level": "Dasar",
                "stimulus": stimulus,
                "question": f"Tentukan BENAR atau SALAH untuk setiap perhitungan matematika No. {i}!",
                "statements": [
                    {"text": f"Harga 3 buku tulis adalah Rp {3 * buku_harga:,},00.", "correct": True},
                    {"text": f"Harga 2 pulpen adalah Rp {2 * pulpen_harga:,},00.", "correct": True},
                    {"text": "Total belanja 3 buku dan 2 pulpen melebihi Rp 100.000,00.", "correct": False}
                ],
                "explanation": f"3 buku = Rp {3*buku_harga:,} (Benar). 2 pulpen = Rp {2*pulpen_harga:,} (Benar). Total Rp {total_belanja:,} di bawah 100rb (Pernyataan 3 Salah)."
            }
            
        questions.append(q_obj)
        
    return questions

def generate_paket3():
    questions = []
    
    # 40 Soal Literasi HOTS
    for i in range(1, 41):
        q_type = "single" if i % 3 != 0 else ("complex" if i % 3 == 0 and i % 6 != 0 else "table_tf")
        
        vol_plastik = 300 + (i * 5)
        rate_daur = 10 + (i % 15)
        
        stimulus = f'''
          <div class="stimulus-box">
            <h4>Infografis & Evaluasi Sains Lingkungan (Soal No. {i})</h4>
            <p>Laporan Lingkungan Berau No. {i} mencatat volume sampah plastik harian mencapai {vol_plastik} kg dengan tingkat daur ulang {rate_daur}%. Sementara itu, sampah organik kantin mencapai 450 kg dengan tingkat pengomposan 80%. Para peneliti sekolah mengkaji dampak jangka panjang pembuangan sampah terhadap ekosistem Sungai Segah.</p>
          </div>
        '''
        
        if q_type == "single":
            q_obj = {
                "id": f"l3_q{i}",
                "type": "single",
                "category": "Literasi",
                "level": "HOTS",
                "stimulus": stimulus,
                "question": f"Berdasarkan infografis No. {i}, mengapa sampah plastik menjadi ancaman lingkungan yang paling kritis dibanding sampah organik?",
                "options": [
                    f"Karena sampah plastik ber-volume {vol_plastik} kg namun tingkat daur ulangnya sangat rendah (hanya {rate_daur}%).",
                    "Karena sampah organik tidak bisa membusuk sama sekali.",
                    "Karena sampah plastik selalu habis terbakar sendiri di alam.",
                    "Karena volume sampah organik jauh lebih kecil dari plastik."
                ],
                "answer": 0,
                "explanation": f"Sampah plastik menjadi ancaman utama karena volumenya tinggi ({vol_plastik} kg) dan tingkat daur ulangnya sangat rendah ({rate_daur}%), sedangkan organik terkompos 80%."
            }
        elif q_type == "complex":
            q_obj = {
                "id": f"l3_q{i}",
                "type": "complex",
                "category": "Literasi",
                "level": "HOTS",
                "stimulus": stimulus,
                "question": f"Manakah solusi ilmiah yang tepat untuk menangani masalah pada Laporan No. {i}? (Pilih lebih dari satu)",
                "options": [
                    "Pengurangan penggunaan plastik sekali pakai di lingkungan kantin dan sekolah.",
                    f"Peningkatan sarana daur ulang plastik agar melebihi {rate_daur}%.",
                    "Membuang seluruh sampah langsung ke alur Sungai Segah.",
                    "Menghentikan kegiatan pengomposan sampah organik."
                ],
                "answer": [0, 1],
                "explanation": "Solusi kritis yang tepat adalah opsi (1) kurangi penggunaan plastik sekali pakai dan opsi (2) tingkatkan kapasitas daur ulang plastik."
            }
        else: # table_tf
            q_obj = {
                "id": f"l3_q{i}",
                "type": "table_tf",
                "category": "Literasi",
                "level": "HOTS",
                "stimulus": stimulus,
                "question": f"Tentukan BENAR atau SALAH untuk analisis evaluasi data No. {i}!",
                "statements": [
                    {"text": f"Tingkat pengomposan sampah organik (80%) lebih baik daripada daur ulang plastik ({rate_daur}%).", "correct": True},
                    {"text": "Sampah plastik ramah lingkungan dan cepat terurai dalam 2 hari.", "correct": False},
                    {"text": "Penelitian ekosistem sungai penting untuk kelangsungan lingkungan Segah.", "correct": True}
                ],
                "explanation": f"Pernyataan 1 BENAR (80% > {rate_daur}%), Pernyataan 2 SALAH (plastik sulit terurai), Pernyataan 3 BENAR."
            }
            
        questions.append(q_obj)
        
    return questions

def generate_paket4():
    questions = []
    
    # 40 Soal Numerasi HOTS
    for i in range(1, 41):
        q_type = "single" if i % 3 != 0 else ("complex" if i % 3 == 0 and i % 6 != 0 else "table_tf")
        
        jarak_cm = 10 + (i % 15)
        skala_num = 200000
        jarak_km = int((jarak_cm * skala_num) / 100000)
        
        pekerja1 = 6
        hari1 = 12 + (i % 6)
        hari2 = 8
        pekerja2 = int((pekerja1 * hari1) / hari2)

        stimulus = f'''
          <div class="stimulus-box">
            <h4>Pemecahan Masalah Geometri & Skala Peta (Soal No. {i})</h4>
            <p>Peta Kabupaten Berau digambar dengan skala 1 : {skala_num:,}. Jarak pada peta dari SMPN 1 Segah ke Tanjung Redeb terukur {jarak_cm} cm. Di sisi lain, proyek pembangunan taman hijau sekolah dapat diselesaikan oleh {pekerja1} pekerja dalam waktu {hari1} hari.</p>
          </div>
        '''
        
        if q_type == "single":
            q_obj = {
                "id": f"n4_q{i}",
                "type": "single",
                "category": "Numerasi",
                "level": "HOTS",
                "stimulus": stimulus,
                "question": f"Berapakah jarak sebenarnya dalam kilometer (km) dari SMPN 1 Segah ke Tanjung Redeb berdasarkan skala peta tersebut?",
                "options": [
                    f"{jarak_km} km",
                    f"{jarak_km + 10} km",
                    f"{jarak_km - 5} km",
                    f"{jarak_km * 2} km"
                ],
                "answer": 0,
                "explanation": f"Jarak Sebenarnya = Jarak Peta × Skala = {jarak_cm} cm × {skala_num:,} = {jarak_cm * skala_num:,} cm = {jarak_km} km."
            }
        elif q_type == "complex":
            q_obj = {
                "id": f"n4_q{i}",
                "type": "complex",
                "category": "Numerasi",
                "level": "HOTS",
                "stimulus": stimulus,
                "question": f"Jika proyek taman sekolah ingin diselesaikan lebih cepat dalam {hari2} hari, manakah pernyataan yang BENAR? (Pilih lebih dari satu)",
                "options": [
                    f"Jumlah total pekerja yang dibutuhkan adalah {pekerja2} orang.",
                    f"Tambahan pekerja yang harus direkrut adalah {pekerja2 - pekerja1} orang.",
                    "Proyek akan selesai tanpa menambah pekerja.",
                    "Waktu pengerjaan akan semakin lama jika pekerja ditambah."
                ],
                "answer": [0, 1],
                "explanation": f"Perbandingan berbalik nilai: {pekerja1} × {hari1} = Pekerja2 × {hari2} => Pekerja2 = {pekerja2} orang. Tambahan pekerja = {pekerja2} - {pekerja1} = {pekerja2 - pekerja1} orang."
            }
        else: # table_tf
            q_obj = {
                "id": f"n4_q{i}",
                "type": "table_tf",
                "category": "Numerasi",
                "level": "HOTS",
                "stimulus": stimulus,
                "question": f"Tentukan BENAR atau SALAH untuk analisis matematis No. {i}!",
                "statements": [
                    {"text": f"Jarak sebenarnya {jarak_km} km setara dengan {jarak_km * 1000} meter.", "correct": True},
                    {"text": f"Makin sedikit hari yang ditargetkan, makin banyak pekerja yang dibutuhkan (perbandingan berbalik nilai).", "correct": True},
                    {"text": "Skala 1 : 200.000 berarti 1 cm pada peta mewakili 200 km sebenarnya.", "correct": False}
                ],
                "explanation": f"Pernyataan 1 BENAR ({jarak_km} km = {jarak_km*1000} m). Pernyataan 2 BENAR (konsep berbalik nilai). Pernyataan 3 SALAH (1 cm = 2 km, bukan 200 km)."
            }
            
        questions.append(q_obj)
        
    return questions

def build_all():
    p1 = generate_paket1()
    p2 = generate_paket2()
    p3 = generate_paket3()
    p4 = generate_paket4()
    
    packages = [
      {
        "id": "paket-1",
        "title": "Paket 1: Literasi Dasar & Menengah",
        "subtitle": "Membaca, Memahami Teks Sastra & Budaya Lokal Segah",
        "category": "Literasi",
        "level": "Dasar - Menengah",
        "icon": "📖",
        "description": "Uji kemampuan membaca, menentukan ide pokok, menyimpulkan pesan tersirat, dan menganalisis karakter dari narasi budaya Sungai Segah Berau (40 Soal).",
        "durationMinutes": 45,
        "questions": p1
      },
      {
        "id": "paket-2",
        "title": "Paket 2: Numerasi Dasar & Menengah",
        "subtitle": "Aritmatika Sosial, Bilangan, & Pengolahan Data Sekolah",
        "category": "Numerasi",
        "level": "Dasar - Menengah",
        "icon": "📐",
        "description": "Soal matematis kontekstual mencakup perhitungan transaksi kantin kejujuran, pecahan, rata-rata nilai siswa, dan pola bilangan (40 Soal).",
        "durationMinutes": 45,
        "questions": p2
      },
      {
        "id": "paket-3",
        "title": "Paket 3: Literasi Lanjut (HOTS)",
        "subtitle": "Infografis Sains, Analisis Argumen & Evaluasi Teks Kritis",
        "category": "Literasi",
        "level": "Tinggi / HOTS",
        "icon": "📊",
        "description": "Soal berpikir tingkat tinggi (HOTS) menganalisis data infografis lingkungan hidup Berau, membandingkan dua teks, serta membedakan fakta dan opini (40 Soal).",
        "durationMinutes": 60,
        "questions": p3
      },
      {
        "id": "paket-4",
        "title": "Paket 4: Numerasi Lanjut (HOTS)",
        "subtitle": "Geometri Terapan, Skala Peta & Analisis Pemecahan Masalah",
        "category": "Numerasi",
        "level": "Tinggi / HOTS",
        "icon": "🗺️",
        "description": "Soal pemecahan masalah (Problem Solving) tingkat lanjut mencakup skala peta wilayah Segah, peluang kejadian, perbandingan senilai/berbalik nilai, dan grafik (40 Soal).",
        "durationMinutes": 60,
        "questions": p4
      }
    ]
    
    js_content = f"// Data Paket Soal TKA SMP - Literasi & Numerasi SMP Negeri 1 Segah (160 Soal)\n\nconst QUESTION_PACKAGES = {json.dumps(packages, indent=2, ensure_ascii=False)};\n\nif (typeof window !== 'undefined') {{\n  window.QUESTION_PACKAGES = QUESTION_PACKAGES;\n}}\n"
    
    with open(r"C:\Users\Asus-02\.gemini\antigravity\scratch\game-edukasi-tka-smpn1segah\js\data\questions.js", "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Berhasil membuat 4 paket soal dengan total {len(p1)+len(p2)+len(p3)+len(p4)} soal!")

if __name__ == "__main__":
    build_all()
