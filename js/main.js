/* ============================================
   AKG Indonesia - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==================== PAGE LOADER ==================== */
  const loader = document.querySelector('.page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      if (typeof revealOnLoad === 'function') {
        revealOnLoad();
      }
    }, 800);
  });

  /* ==================== NAVBAR ==================== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Scroll Effect
  const handleNavScroll = () => {
    if (document.querySelector('.hero')) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    } else {
      navbar.classList.add('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // Scroll Progress Bar
  if (navbar) {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    navbar.appendChild(progressBar);

    const updateProgressBar = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();
  }

  // Mobile Menu Toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = navMenu.querySelectorAll('a:not(.navbar-cta)');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === '#' + id) {
            l.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav);

  /* ==================== SMOOTH SCROLL ==================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ==================== HERO PARTICLES ==================== */
  const heroParticles = document.querySelector('.hero-particles');
  if (heroParticles) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = (Math.random() * 3 + 2) + 'px';
      particle.style.animationDuration = (Math.random() * 14 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      heroParticles.appendChild(particle);
    }
  }

  /* ==================== SCROLL REVEAL ==================== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealOnLoad = () => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // If the element's top is within the viewport on load
      if (rect.top < window.innerHeight) {
        const parent = el.closest('[data-stagger]');
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
          const idx = siblings.indexOf(el);
          setTimeout(() => {
            el.classList.add('active');
          }, idx * 100);
        } else {
          el.classList.add('active');
        }
      }
    });
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger animation for children
        const parent = entry.target.closest('[data-stagger]');
        if (parent) {
          const siblings = Array.from(parent.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('active');
          }, idx * 100);
        } else {
          entry.target.classList.add('active');
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==================== COUNTER ANIMATION ==================== */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current >= target) {
            entry.target.textContent = target + suffix;
          } else {
            entry.target.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
          }
        };
        updateCounter();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ==================== FORM MULTI-STEP ==================== */
  const formSteps = document.querySelectorAll('.form-step');
  const stepIndicators = document.querySelectorAll('.step');
  const stepConnectors = document.querySelectorAll('.step-connector');
  let currentStep = 0;

  const showStep = (idx) => {
    formSteps.forEach((step, i) => {
      step.style.display = i === idx ? 'block' : 'none';
    });
    stepIndicators.forEach((indicator, i) => {
      indicator.classList.remove('active', 'completed');
      if (i < idx) indicator.classList.add('completed');
      if (i === idx) indicator.classList.add('active');
    });
    currentStep = idx;
  };

  // Next buttons
  document.querySelectorAll('[data-step-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < formSteps.length - 1) {
        showStep(currentStep + 1);
        // Scroll to form
        const formEl = document.querySelector('.form-container');
        if (formEl) {
          const top = formEl.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // Prev buttons
  document.querySelectorAll('[data-step-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
        const formEl = document.querySelector('.form-container');
        if (formEl) {
          const top = formEl.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // Form Submit
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const container = document.querySelector('.form-container');
      container.innerHTML = `
        <div style="text-align:center; padding: 80px 20px;">
          <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(145deg,#f0f0f0,#c0c8d4);display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
            <i class="fas fa-check" style="font-size:2rem;color:#0f2442;"></i>
          </div>
          <h3 style="font-family:var(--font-display);font-size:1.8rem;margin-bottom:16px;">Pendaftaran Berhasil!</h3>
          <p style="color:var(--silver-400);font-size:1rem;line-height:1.7;max-width:500px;margin:0 auto;">
            Terima kasih telah mendaftar di program AKG Indonesia. Tim kami akan menghubungi Anda dalam 1x24 jam melalui WhatsApp atau email.
          </p>
        </div>
      `;
    });
  }

  /* ==================== MODERN FILE UPLOAD ==================== */
  document.querySelectorAll('.file-upload-modern').forEach(uploadEl => {
    const input = uploadEl.querySelector('input[type="file"]');
    const preview = uploadEl.querySelector('.file-upload-preview');
    const previewText = preview ? preview.querySelector('span') : null;

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(evt => {
      uploadEl.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadEl.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(evt => {
      uploadEl.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadEl.classList.remove('dragover');
      });
    });
    uploadEl.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        input.files = files;
        showFilePreview(files[0], preview, previewText);
      }
    });

    // Regular file select
    input.addEventListener('change', () => {
      if (input.files.length > 0) {
        showFilePreview(input.files[0], preview, previewText);
      }
    });
  });

  function showFilePreview(file, previewEl, textEl) {
    if (previewEl && textEl) {
      textEl.textContent = file.name;
      previewEl.classList.add('has-file');
    }
  }

  /* ==================== PARALLAX ==================== */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.3}px) scale(1.05)`;
      }
    });
  }

  /* ==================== BACK TO TOP ==================== */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==================== SMOOTH SCROLL FROM EXTERNAL PAGE ==================== */
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    }, 900);
  }

  /* ==================== DYNAMIC CONTENT DATA ==================== */
  const akgData = {
    kegiatan: {
      'workshop-persiapan': {
        title: 'Workshop Persiapan Beasiswa Al Azhar Cairo 2027',
        category: 'Workshop',
        date: '15 Juli 2027',
        location: 'Aula Islamic Center / Online via Zoom',
        image: 'assets/img/galeri-seminar.png',
        content: `
          <p>Ashabul Kahfi Generation (AKG) kembali mengadakan program tahunan <strong>Workshop Persiapan Beasiswa Al Azhar Cairo 2027</strong>. Program ini dirancang khusus bagi calon mahasiswa yang ingin melangkah ke jenjang pendidikan tinggi di Universitas Al Azhar, Mesir, dengan persiapan yang matang dan terarah.</p>
          <p>Dalam workshop ini, peserta akan mendapatkan bimbingan intensif mengenai berbagai aspek penting, mulai dari persiapan berkas administrasi, pemahaman materi ujian masuk (syahadah & tes kompetensi bahasa), hingga simulasi wawancara langsung bersama para alumni Al Azhar.</p>
          <h3>Materi yang Akan Dibahas:</h3>
          <ul>
            <li>Persyaratan administrasi terbaru dan penerjemahan dokumen resmi.</li>
            <li>Tips & trik lolos seleksi berkas dan tes tertulis.</li>
            <li>Pembahasan materi bahasa Arab (Kitabah, Qira'ah, Istima') yang sering diujikan.</li>
            <li>Teknik wawancara (interview) yang meyakinkan dalam bahasa Arab.</li>
            <li>Pengenalan budaya, kurikulum, dan kehidupan sosial di Kairo, Mesir.</li>
          </ul>
          <p>Jangan lewatkan kesempatan emas ini untuk mempersiapkan diri secara menyeluruh bersama mentor-mentor berpengalaman dari AKG Indonesia yang telah sukses mendampingi ratusan alumni.</p>
        `
      },
      'pre-departure-camp': {
        title: 'Pre-Departure Camp Keberangkatan Al Azhar Cairo 2027',
        category: 'Camp',
        date: '5 Agustus 2027',
        location: 'Villa Elewana, Madiun',
        image: 'assets/img/villa-elewana.png',
        content: `
          <p><strong>Pre-Departure Camp</strong> merupakan program pembekalan akhir dan karantina intensif selama 5 hari bagi seluruh peserta AKG yang telah dinyatakan lolos dan siap berangkat ke Kairo, Mesir. Bertempat di lingkungan asri <strong>Villa Elewana, Madiun</strong>, program ini berfokus pada penguatan mental, kemandirian, dan adaptasi kultural.</p>
          <p>Selama camp berlangsung, para peserta akan dikondisikan dalam lingkungan semi-karantina di mana komunikasi harian menggunakan bahasa Arab. Selain itu, ada juga penguatan spiritual untuk memastikan misi belajar "Generasi Rabbani" tertanam kuat dalam diri setiap calon mahasiswa.</p>
          <h3>Agenda & Aktivitas Utama:</h3>
          <ul>
            <li><strong>Intensive Arabic Speaking:</strong> Praktek percakapan sehari-hari dengan dialek Mesir (Amiyah).</li>
            <li><strong>Mental & Adaptability Training:</strong> Simulasi menghadapi perbedaan budaya dan dinamika hidup mandiri di luar negeri.</li>
            <li><strong>Spiritual Character Building:</strong> Qiyamul Lail, kajian tafsir, dan komitmen dakwah sebagai duta bangsa.</li>
            <li><strong>Administrative Briefing:</strong> Penjelasan alur ketibaan di bandara Kairo, imigrasi, tempat tinggal, dan registrasi kampus.</li>
            <li><strong>Bonding & Networking:</strong> Mempererat rasa kekeluargaan antar-sesama mahasiswa keberangkatan 2027.</li>
          </ul>
          <p>Melalui pembekalan ini, AKG berkomitmen melahirkan lulusan yang tidak hanya cerdas secara akademik tetapi juga kokoh secara spiritual dan siap bersaing di kancah global.</p>
        `
      },
      'seminar-timur-tengah': {
        title: 'Seminar Eksklusif Studi di Timur Tengah',
        category: 'Seminar',
        date: '22 Juli 2027',
        location: 'Grand Ballroom Hotel Royal Navy, Surabaya',
        image: 'assets/img/galeri-mentoring.png',
        content: `
          <p>Ingin tahu lebih banyak mengenai peluang beasiswa dan jalur mandiri studi di negara-negara Timur Tengah seperti Mesir, Madinah, dan Maroko? AKG Indonesia menghadirkan <strong>Seminar Eksklusif Studi di Timur Tengah</strong> untuk menjawab seluruh pertanyaan Anda.</p>
          <p>Seminar ini menghadirkan narasumber dari jajaran diplomat, akademisi, serta alumni berprestasi yang akan membagikan wawasan mendalam mengenai lanskap pendidikan di Timur Tengah, peluang karir setelah lulus, dan peran strategis alumni dalam pembangunan peradaban Islam global.</p>
          <h3>Pembicara & Topik Utama:</h3>
          <ul>
            <li><strong>Jalur Resmi & Beasiswa:</strong> Memahami perbedaan jalur Kemenag, jalur kedutaan, dan jalur beasiswa langsung dari kampus.</li>
            <li><strong>Lanskap Akademik:</strong> Mengenal keunggulan masing-masing universitas terbaik di Timur Tengah (Al Azhar Mesir, Universitas Islam Madinah, dll.).</li>
            <li><strong>Peluang Karir Global:</strong> Prospek alumni Timur Tengah di sektor pendidikan, diplomasi, bisnis syariah, dan lembaga internasional.</li>
            <li><strong>Kiat Sukses Studi:</strong> Manajemen waktu, adaptasi iklim, dan strategi lulus tepat waktu dengan predikat Mumtaz.</li>
          </ul>
          <p>Acara ini terbuka untuk pelajar, santri, mahasiswa, pendidik, dan orang tua yang ingin mendapatkan informasi valid dan bimbingan terpercaya.</p>
        `
      }
    },
    artikel: {
      'panduan-beasiswa': {
        title: 'Panduan Lengkap Beasiswa Al Azhar Cairo 2027',
        date: '20 Mei 2027',
        author: 'Admin AKG',
        image: 'assets/img/artikel-header.png',
        content: `
          <p>Universitas Al Azhar di Kairo, Mesir, adalah kiblat utama pendidikan Islam dunia yang telah berdiri lebih dari seribu tahun. Setiap tahunnya, ribuan pelajar dari seluruh penjuru Indonesia bersaing memperebutkan kuota beasiswa melalui jalur resmi Kementerian Agama (Kemenag) maupun beasiswa langsung. Berikut adalah panduan komprehensif dari AKG untuk membantu Anda sukses meraih beasiswa Al Azhar Cairo 2027.</p>
          <h3>1. Persyaratan Administrasi Utama</h3>
          <p>Persiapan dokumen adalah langkah paling awal dan sangat krusial. Pastikan dokumen-dokumen berikut telah diterjemahkan ke dalam bahasa Arab oleh penerjemah tersumpah dan dilegalisasi di Kemenkumham, Kemenlu, dan Kedutaan Besar Mesir:</p>
          <ul>
            <li>Ijazah dan Transkrip Nilai MA/SMA/Sederajat (nilai rata-rata minimal 75-80).</li>
            <li>Paspor yang masih berlaku minimal 18 bulan sejak tanggal keberangkatan.</li>
            <li>Akte Kelahiran dan Kartu Keluarga terbaru.</li>
            <li>Surat Keterangan Catatan Kepolisian (SKCK) asli.</li>
            <li>Surat Rekomendasi dari pondok pesantren atau lembaga keagamaan resmi.</li>
          </ul>
          <h3>2. Tahapan Seleksi Masuk</h3>
          <p>Ujian masuk Universitas Al Azhar terdiri dari dua tahap seleksi utama yang diselenggarakan secara online maupun offline:</p>
          <ul>
            <li><strong>Ujian Tulis (Ikhtibar Tahsili):</strong> Menguji kemampuan bahasa Arab (Shorof, Nahwu, Balaghah) dan pengetahuan keislaman umum (Tafsir, Hadits, Fiqih, Sejarah Kebudayaan Islam).</li>
            <li><strong>Ujian Lisan (Ikhtibar Syafahi):</strong> Tes wawancara bahasa Arab untuk mengukur kefasihan berbicara, hafalan Al-Qur'an (minimal 2-3 juz), dan motivasi belajar peserta.</li>
          </ul>
          <h3>3. Tips Sukses dari Mentor AKG</h3>
          <p>Berdasarkan pengalaman mendampingi ratusan peserta, berikut adalah tips terbaik untuk Anda:</p>
          <p><strong>Perkuat Kemampuan Bahasa Arab Aktif:</strong> Latihan menulis, membaca teks gundul (kitab kuning), dan biasakan berbicara dalam bahasa Arab fusha (resmi). Jangan hanya fokus pada tata bahasa (Qawaid), melainkan juga pada pembendaharaan kosakata (Mufradat) dan pemahaman teks.</p>
          <p><strong>Ikuti Bimbingan Belajar Khusus:</strong> Mengikuti bimbingan belajar khusus studi Timur Tengah seperti yang diselenggarakan oleh AKG akan sangat membantu Anda dalam memahami format soal tahun-tahun sebelumnya dan melatih mental wawancara.</p>
        `
      },
      'tips-adaptasi': {
        title: '5 Tips Sukses Adaptasi Studi di Luar Negeri',
        date: '15 Mei 2027',
        author: 'Tim Akademik',
        image: 'assets/img/galeri-mentoring.png',
        content: `
          <p>Melanjutkan pendidikan di luar negeri adalah impian banyak orang, namun di balik antusiasme tersebut terdapat tantangan adaptasi budaya (culture shock), iklim, bahasa, dan sistem belajar yang baru. Agar masa transisi Anda berjalan mulus dan sukses, berikut adalah 5 tips adaptasi studi di luar negeri dari Tim Akademik AKG Indonesia.</p>
          <h3>1. Kenali Budaya dan Kebiasaan Lokal Sebelum Berangkat</h3>
          <p>Sebelum kaki Anda menginjakkan kaki di negara tujuan, luangkan waktu untuk membaca dan mempelajari norma sosial, adat istiadat, dan kebiasaan sehari-hari masyarakat setempat. Memahami hal ini akan menghindarkan Anda dari kesalahan berkomunikasi dan membantu Anda berbaur lebih cepat.</p>
          <h3>2. Kuasai Percakapan Dasar Bahasa Setempat</h3>
          <p>Meskipun perkuliahan Anda menggunakan bahasa pengantar formal (seperti bahasa Arab Fusha), menguasai dialek lokal sehari-hari (seperti bahasa Arab Amiyah di Mesir) sangatlah penting untuk keperluan sehari-hari seperti belanja di pasar, menggunakan transportasi umum, dan berinteraksi dengan warga lokal.</p>
          <h3>3. Bersikap Terbuka dan Aktif Menjalin Pertemanan</h3>
          <p>Jangan membatasi diri hanya bergaul dengan sesama mahasiswa dari Indonesia. Bersikaplah ramah dan mulailah berkenalan dengan mahasiswa internasional lainnya serta warga lokal. Ini akan memperluas jaringan Anda dan mempercepat proses adaptasi bahasa.</p>
          <h3>4. Kelola Homesickness dengan Aktivitas Positif</h3>
          <p>Rindu rumah dan keluarga adalah hal yang wajar. Atasi perasaan tersebut dengan tetap berkomunikasi secara teratur dengan keluarga, serta aktif mengikuti kegiatan ekstrakurikuler, organisasi mahasiswa, atau hobi baru di kampus.</p>
          <h3>5. Jaga Kesehatan Fisik dan Mental</h3>
          <p>Perbedaan iklim dan makanan seringkali memicu masalah kesehatan di awal ketibaan. Pastikan Anda mengonsumsi makanan bergizi, beristirahat cukup, dan ketahuilah lokasi klinik atau fasilitas kesehatan terdekat di sekitar tempat tinggal Anda.</p>
        `
      },
      'kisah-alumni': {
        title: 'Kisah Alumni: Dari Madiun ke Al Azhar Cairo',
        date: '10 Mei 2027',
        author: 'Alumni AKG',
        image: 'assets/img/galeri-seminar.png',
        content: `
          <p>Menempuh studi di universitas Islam tertua di dunia, Al Azhar Cairo, merupakan impian masa kecil bagi Ahmad, seorang santri asal Madiun, Jawa Timur. Melalui perjuangan keras, ketekunan, dan pendampingan yang tepat dari AKG Indonesia, impian tersebut kini telah menjadi kenyataan. Berikut adalah kisah inspiratif Ahmad dalam meraih cita-citanya.</p>
          <h3>Awal Mula Perjalanan</h3>
          <p>Ahmad tumbuh di lingkungan pesantren tradisional di Madiun. Meskipun memiliki dasar agama dan bahasa Arab yang cukup baik, ia merasa kebingungan mengenai tata cara pendaftaran, penerjemahan berkas, dan proses visa untuk belajar di Mesir.</p>
          <p>"Saya tahu saya ingin ke Al Azhar, tapi informasi yang saya dapatkan sangat simpang siur. Berkas apa saja yang harus disiapkan? Bagaimana dengan ujian masuknya? Semuanya terasa sangat rumit di awal," ujar Ahmad mengenang masa lalunya.</p>
          <h3>Peran AKG dalam Membuka Jalan</h3>
          <p>Titik balik perjuangan Ahmad terjadi ketika ia mengikuti Seminar Timur Tengah yang diadakan oleh AKG Indonesia di Madiun. Tertarik dengan program pendampingan end-to-end, Ahmad memutuskan untuk bergabung dengan bimbingan belajar AKG.</p>
          <p>Selama 6 bulan, Ahmad digembleng secara intensif dalam kelas persiapan bahasa Arab, simulasi ujian tertulis, dan pelatihan wawancara. Selain aspek akademik, AKG juga membantu seluruh proses administrasi berkas dan visa Ahmad hingga tuntas tanpa kendala.</p>
          <p>"AKG bukan hanya mengurus pendaftaran saya, tapi benar-benar mendidik saya. Ketika saya mengikuti ujian masuk Kemenag, materi yang diujikan rasanya sangat mirip dengan apa yang kami pelajari setiap hari di kelas bimbingan AKG," kata Ahmad dengan penuh syukur.</p>
          <h3>Kehidupan Baru di Cairo</h3>
          <p>Kini Ahmad telah memasuki tahun kedua kuliahnya di Fakultas Ushuluddin, Universitas Al Azhar. Proses adaptasinya berjalan sangat lancar berkat Pre-Departure Camp yang diikutinya sebelum keberangkatan.</p>
          <p>Ahmad berpesan kepada seluruh santri dan pelajar di Indonesia untuk tidak pernah takut bermimpi tinggi: "Pendidikan di luar negeri itu nyata dan bisa dicapai oleh siapa saja, asalkan kita mau belajar dengan tekun dan dibimbing oleh sistem yang tepat. Teruslah berusaha, percayalah pada proses, dan bertawakkal."</p>
        `
      }
    }
  };

  /* ==================== DYNAMIC DETAIL PAGES RENDERING ==================== */
  const renderDetailPage = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const path = window.location.pathname;

    if (path.includes('kegiatan-detail.html')) {
      const data = akgData.kegiatan[id] || akgData.kegiatan['workshop-persiapan'];
      if (data) {
        document.title = data.title + ' | AKG Indonesia';
        const titleEl = document.querySelector('.detail-title');
        const breadcrumbEl = document.querySelector('.current-breadcrumb');
        const coverEl = document.querySelector('.detail-cover img');
        const dateEl = document.querySelector('.detail-date-text');
        const locationEl = document.querySelector('.detail-location-text');
        const contentEl = document.querySelector('.detail-content-text');
        const tagEl = document.querySelector('.detail-tag-text');

        if (titleEl) titleEl.textContent = data.title;
        if (breadcrumbEl) breadcrumbEl.textContent = data.title;
        if (coverEl) {
          coverEl.src = data.image;
          coverEl.alt = data.title;
        }
        if (dateEl) dateEl.innerHTML = `<i class="fas fa-calendar-alt"></i> ${data.date}`;
        if (locationEl) locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.location}`;
        if (tagEl) tagEl.textContent = data.category;
        if (contentEl) contentEl.innerHTML = data.content;
      }
    } else if (path.includes('artikel-detail.html')) {
      const data = akgData.artikel[id] || akgData.artikel['panduan-beasiswa'];
      if (data) {
        document.title = data.title + ' | AKG Indonesia';
        const titleEl = document.querySelector('.detail-title');
        const breadcrumbEl = document.querySelector('.current-breadcrumb');
        const coverEl = document.querySelector('.detail-cover img');
        const dateEl = document.querySelector('.detail-date-text');
        const authorEl = document.querySelector('.detail-author-text');
        const contentEl = document.querySelector('.detail-content-text');

        if (titleEl) titleEl.textContent = data.title;
        if (breadcrumbEl) breadcrumbEl.textContent = data.title;
        if (coverEl) {
          coverEl.src = data.image;
          coverEl.alt = data.title;
        }
        if (dateEl) dateEl.innerHTML = `<i class="fas fa-calendar"></i> ${data.date}`;
        if (authorEl) authorEl.innerHTML = `<i class="fas fa-user"></i> ${data.author}`;
        if (contentEl) contentEl.innerHTML = data.content;
      }
    }
  };

  renderDetailPage();

  /* ==================== AI CHATBOT FUNCTIONALITY ==================== */
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatWindow = document.getElementById('chatWindow');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  const menuOptions = [
    "🎓 Info Beasiswa",
    "📍 Lokasi Karantina",
    "📝 Cara Mendaftar",
    "📞 Hubungi WhatsApp"
  ];

  if (chatToggleBtn && chatWindow) {
    // Open/Close Chat
    chatToggleBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
      // Hide red alert badge on first click
      const badge = chatToggleBtn.querySelector('.chat-badge');
      if (badge) badge.style.display = 'none';
      
      // Focus on input
      if (chatWindow.classList.contains('open')) {
        setTimeout(() => chatInput.focus(), 300);
      }
    });

    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
      });
    }

    // Initialize Welcome Suggestions
    if (chatMessages) {
      setTimeout(() => {
        appendSuggestions(menuOptions);
      }, 600);
    }

    // Handle message submit
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageText = chatInput.value.trim();
      if (!messageText) return;

      // Remove existing suggestions
      const existing = chatMessages.querySelectorAll('.chat-suggestions');
      existing.forEach(el => el.remove());

      // Add user message
      appendMessage(messageText, 'user-message');
      chatInput.value = '';

      // Simulate Bot typing indicator
      showTypingIndicator();

      // Formulate bot response based on keywords
      const reply = getBotReply(messageText);

      // Delay response for realism
      setTimeout(() => {
        removeTypingIndicator();
        appendMessage(reply, 'bot-message');
        
        // Show options again after reply
        setTimeout(() => {
          appendSuggestions(menuOptions);
        }, 600);
      }, 1200 + Math.random() * 800);
    });
  }

  function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    // Parse **bold** markdown to <strong>bold</strong> HTML tag
    const parsedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    messageDiv.innerHTML = `
      <div class="message-content">${parsedText}</div>
      <span class="message-time">${hours}:${minutes}</span>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendSuggestions(options) {
    // Remove existing suggestion grids if any
    const existing = chatMessages.querySelectorAll('.chat-suggestions');
    existing.forEach(el => el.remove());

    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'chat-suggestions';

    options.forEach(opt => {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';
      chip.type = 'button';
      chip.textContent = opt;
      chip.addEventListener('click', () => {
        handleSuggestionClick(opt);
      });
      suggestionsDiv.appendChild(chip);
    });

    chatMessages.appendChild(suggestionsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleSuggestionClick(text) {
    // Remove suggestions immediately
    const existing = chatMessages.querySelectorAll('.chat-suggestions');
    existing.forEach(el => el.remove());

    // Add user message
    appendMessage(text, 'user-message');

    // Show typing
    showTypingIndicator();

    // Clean emoji/symbols for keyword matching
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();

    const reply = getBotReply(cleanText);

    setTimeout(() => {
      removeTypingIndicator();
      appendMessage(reply, 'bot-message');
      
      // Append suggestions again so they can easily query
      setTimeout(() => {
        appendSuggestions(menuOptions);
      }, 600);
    }, 1000 + Math.random() * 500);
  }

  function showTypingIndicator() {
    // Check if indicator already exists
    if (document.getElementById('chatTypingIndicator')) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'chatTypingIndicator';
    typingDiv.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chatTypingIndicator');
    if (indicator) indicator.remove();
  }

  function getBotReply(userMsg) {
    const msg = userMsg.toLowerCase();

    if (msg.includes('beasiswa') || msg.includes('azhar') || msg.includes('cairo') || msg.includes('mesir')) {
      return "Program **Beasiswa Al Azhar Cairo 2027** adalah program unggulan AKG! Kami menyediakan pendampingan lengkap dari pendaftaran berkas, bimbingan akademik, hingga karantina intensif di Madiun. Tertarik? Silakan isi **Form Pendaftaran** di bagian bawah homepage! 🎓";
    }
    if (msg.includes('biaya') || msg.includes('harga') || msg.includes('bayar')) {
      return "Untuk rincian biaya program pembekalan dan pendampingan studi luar negeri, konsultan kami akan menghubungi Anda secara pribadi agar lebih detail. Silakan isi data diri Anda di **Form Pendaftaran** di bagian bawah halaman ini! 💸";
    }
    if (msg.includes('lokasi') || msg.includes('alamat') || msg.includes('kantor') || msg.includes('madiun') || msg.includes('villa')) {
      return "AKG Indonesia berpusat di **Villa Elewana, Jl. Raya Saradan No.10, Madiun, Jawa Timur**. Villa asri ini kami gunakan sebagai lokasi karantina & pembekalan intensif para calon mahasiswa sebelum berangkat! 📍";
    }
    if (msg.includes('kontak') || msg.includes('whatsapp') || msg.includes(' wa ') || msg.includes('email') || msg.includes('telepon')) {
      return "Anda bisa menghubungi kami via email di **info@akgindonesia.co.id**. Namun untuk tanggapan super cepat, silakan isi data diri di **Form Pendaftaran** di bawah, tim kami akan langsung chat Anda via WhatsApp! 📞";
    }
    if (msg.includes('pendaftaran') || msg.includes('daftar') || msg.includes('registrasi') || msg.includes('mendaftar')) {
      return "Pendaftaran program bimbingan dan beasiswa Al Azhar Cairo 2027 sedang dibuka! Silakan scroll ke bagian paling bawah homepage ini untuk mengisi **Form Pendaftaran Multi-step** kami yang super praktis. 📝";
    }
    if (msg.includes('alumni') || msg.includes('kisah') || msg.includes('testimoni')) {
      return "Para alumni program AKG telah sukses menempuh studi di Al Azhar Cairo! Berbagai cerita inspiratif perjuangan mereka dapat Anda baca selengkapnya di halaman khusus **Artikel** kami. 📖";
    }
    if (msg.includes('program') || msg.includes('layanan')) {
      return "Kami menyediakan layanan konsultasi studi Timur Tengah, admission berkas, kelas pembekalan bahasa Arab & syariah, serta karantina di Madiun. Cek penjelasan lengkapnya di bagian **Program Unggulan** kami! 🌟";
    }
    if (msg.includes('partnership') || msg.includes('mitra') || msg.includes('executive')) {
      return "Program **Partnership Executive AKG** dirancang bagi Anda yang ingin menjadi bagian dari tim pemasaran/kemitraan kami dengan sistem keuntungan transparan dan komisi yang sangat menarik. Hubungi kami via email/form jika tertarik! 🤝";
    }
    if (msg.includes('halo') || msg.includes('hai') || msg.includes('assalamualaikum') || msg.includes('siang') || msg.includes('pagi') || msg.includes('sore') || msg.includes('malam') || msg.includes(' test')) {
      return "Halo! Selamat datang di layanan asisten interaktif AKG. Ada yang bisa kami bantu seputar pendaftaran beasiswa, lokasi pembekalan di Madiun, atau program lainnya? 😊";
    }

    return "Terima kasih atas pertanyaannya! Seputar pendampingan studi luar negeri dan beasiswa Al Azhar Cairo, Anda bisa mendaftarkan diri secara gratis melalui **Form Pendaftaran** di bawah halaman ini agar langsung dihubungi oleh konsultan ahli kami via WhatsApp! Ada hal spesifik lain yang ingin ditanyakan? 🌟";
  }

  /* ==================== TESTIMONIALS SLIDER ==================== */
  const slider = document.getElementById('testimonialsSlider');
  if (slider) {
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    let autoSlideInterval;

    // Get dots
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    const showSlide = (idx) => {
      // Boundaries check
      if (idx >= slides.length) idx = 0;
      if (idx < 0) idx = slides.length - 1;

      currentSlide = idx;

      // Update slides active class
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
      });

      // Update dots active class
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    // Next slide
    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };

    // Prev slide
    const prevSlide = () => {
      showSlide(currentSlide - 1);
    };

    // Click listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    // Dots click listeners
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetAutoSlide();
      });
    });

    // Auto-slide every 5 seconds
    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoSlide = () => {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    };

    startAutoSlide();

    // Touch Swiping ("bisa geser-geser" on mobile)
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    }, { passive: true });

    const handleGesture = () => {
      const swipeThreshold = 50; // pixels
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped Left -> Show next slide
        nextSlide();
        resetAutoSlide();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped Right -> Show prev slide
        prevSlide();
        resetAutoSlide();
      }
    };
  }

});
