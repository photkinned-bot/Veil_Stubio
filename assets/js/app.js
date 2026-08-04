        const $ = id => document.getElementById(id);
        window.$ = $;

        // --- i18n Localization Engine ---
        let currentLang = localStorage.getItem('veil_language') || 'uk';

        const translations = {
            uk: {
                app_title: "Veil Studio — Процедурний Генератор Текстур",
                logo_subtitle: "текстурний генератор",
                badge_pro: "PRO 1.0",
                made_in_ukraine: "Зроблено в Україні",
                made_in_ukraine_short: "UA",
                btn_reset: "↺ Скинути",
                btn_reset_title: "Скинути весь проєкт до початкового стану",
                btn_save: "💾 Зберегти .veil",
                btn_save_title: "Завантажити проєкт у файл .veil",
                btn_open: "📂 Відкрити",
                btn_open_title: "Відкрити файл проєкту (.veil / .json)",
                btn_projects: "⚙️ Проєкти",
                btn_projects_title: "Управління проєктом та слотами IDB",
                btn_benchmark: "⚡ Бенчмарк",
                btn_benchmark_title: "Запустити профілювальник та тест навантаження",
                btn_export_png: "Експорт PNG",

                panel_layers: "Шари",
                btn_add_layer: "+ Шар",
                res_label: "Роздільна здатність:",
                render_label: "Рендер:",
                fps_label: "FPS:",
                scale_label: "Масштаб:",
                autosave_title: "Клацніть для перегляду збережених проєктів",
                autosave_active: "Автозбереження: Активне",
                redo_title: "Повторити (Redo)",
                undo_title: "Скасувати (Undo)",
                zoom_in_title: "Збільшити",
                zoom_out_title: "Зменшити",
                rotate_left_title: "Повернути вліво",
                rotate_right_title: "Повернути вправо",
                reset_view_title: "Скинути перегляд",
                res_selector_title: "Роздільна здатність канвасу",
                fast_preview_title: "Тимчасово знижувати якість до 256x256 при перетягуванні повзунків",
                fast_preview_label: "Швидкий прев'ю",
                canvas_border_title: "Увімкнути / вимкнути рамку та ефекти навколо канвасу",
                border_label: "Рамка",
                border_intensity_title: "Натисніть для налаштування інтенсивності",
                border_intensity_label: "Інтенсивність",

                title_layer_props: "Властивості шару",
                title_global_props: "Глобальні ефекти",
                title_tiling_props: "Безшовний Тайлінг PRO",
                tab_layer: "Шар",
                tab_global: "Глобальні",
                tab_tiling: "Тайлінг",

                confirm_title: "Підтвердження",
                btn_cancel: "Скасувати",
                btn_confirm: "Підтвердити",

                png_title: "Експорт PNG",
                png_res: "Роздільна здатність",
                png_instruction: "Затисніть картинку та виберіть \"Зберегти в Фото\" (на мобільному) або ПКМ -> \"Зберегти картинку як\" (на ПК).",
                png_rendering: "Рендеринг...",
                btn_close: "Закрити",

                pm_title: "Менеджер проєктів Veil Studio",
                pm_tab_file: "💾 Файл .veil",
                pm_tab_idb: "⚡ Локальні слоти",
                pm_tab_text: "📝 Текстовий код",
                pm_rec_badge: "⭐ РЕКОМЕНДОВАНИЙ СПОСІБ",
                pm_rec_desc: "Зберігайте проєкт у компактний файл .veil на диск. Всі шари, геометрія та намальовані маски зберігаються без втрат і завантажуються миттєво.",
                pm_download_veil: "Завантажити файл проєкту (.veil)",
                pm_open_veil: "Відкрити файл проєкту (.veil / .json)",
                pm_slot_placeholder: "Назва слоту (необов'язково)...",
                pm_quick_save: "⚡ Швидке збереження",
                pm_saved_slots: "Збережені слоти у браузері",
                pm_json_code: "Код поточного проєкту (JSON)",
                pm_copy_clipboard: "Скопіювати у буфер",
                pm_paste_label: "Вставити код проєкту з буфера",
                pm_paste_placeholder: "Вставте JSON код сюди...",
                pm_read_clipboard: "📋 Читати з буфера",
                pm_load: "Завантажити",

                bench_title: "Профілювальник & Тест Навантаження",
                bench_fps_label: "ЧАС КАДРУ (FPS)",
                bench_mem_label: "ПАМ'ЯТЬ HEAP",
                bench_opt_label: "ОПТИМІЗАЦІЇ",
                bench_opt_active: "6/6 Активні",
                bench_run_title: "Автоматичне стрес-тестування продуктивності",
                bench_run_desc: "Запускає комплексний аналіз: тест швидкості на 256/512/1024, навантаження 5/10/20 шарів, та 30 швидких деформацій для оцінки використання пам'яті.",
                bench_run_btn: "🚀 Запустити Повний Стрес-Тест",
                bench_report_title: "ЗВІТ ПРОДУКТИВНОСТІ",
                bench_grade: "ОЦІНКА: A+",
                bench_res_label: "ЧАС РЕНДЕРУ ПО РОЗДІЛЬНОСТІ",
                bench_multi_label: "БАГАТОШАРОВЕ НАВАНТАЖЕННЯ",
                bench_stress_label: "СТРЕС-ТЕСТ ДИНАМІЧНОЇ ЗМІНИ 30 ПАРАМЕТРІВ",
                bench_success_footer: "✓ Усі критичні алгоритми (Voronoi bitwise hash, sliding box blur, kernel pooling, TypedArray fast-path) підтверджено та оптимізовано!",

                layer_default_name: "Шар 1",
                new_layer_name: "Новий шар",
                copy_suffix: "(Копія)",
                acc_algo: "Алгоритм та Генератор",
                acc_transform: "Трансформація та Масштаб",
                acc_fx: "Локальні Ефекти",
                acc_warps: "Деформатори (Warps)",
                acc_gtform: "Глобальна Трансформація",
                acc_gwarps: "Глобальні Деформатори (Warps)",
                acc_gtiling: "Глобальний Тайлінг",
                acc_gfx: "Глобальна Корекція",
                reset_default_title: "Скинути за замовчуванням ({def})",
                reset_project_confirm: "Скинути ВЕСЬ проєкт до початкового стану? Усі шари та глобальні налаштування буде втрачено.",
                reset_layer_confirm: "Скинути всі параметри шару \"{name}\" до значень за замовчуванням?",
                reset_global_confirm: "Скинути всі глобальні налаштування (корекції, трансформацію, тайлінг) до значень за замовчуванням?",
                drag_layer_tooltip: "Затисніть мишою або пальцем та перетягніть шар",
                hide_layer_tooltip: "Приховати шар",
                show_layer_tooltip: "Показати шар",
                mask_no_target_tooltip: "Маска: немає шару знизу — не відображається",
                mask_target_tooltip: "Цей шар працює як маска для шару знизу",
                mask_badge: "МАСКА",
                use_as_mask_tooltip: "Використати як маску",
                duplicate_layer_tooltip: "Дублювати шар",
                delete_layer_tooltip: "Видалити шар",
                lbl_layer_name: "Назва шару",
                btn_reset_layer: "↺ Скинути шар",
                blend_mode_label: "Режим накладання (Blend)",
                opacity_label: "Непрозорість (%)",

                "Розмір пензля": "Розмір пензля",
                "Інтервал (Крок)": "Інтервал (Крок)",
                "Сила (Непрозорість %)": "Сила (Непрозорість %)",
                "Зона м'якості": "Зона м'якості",
                "Спад градієнта": "Спад градієнта",
                "Кут нахилу пензля": "Кут нахилу пензля",
                "Форма (Стиснення)": "Форма (Стиснення)",
                "Частота": "Частота",
                "Фаза": "Фаза",
                "К-ть Джерел": "К-ть Джерел",
                "Симетрія": "Симетрія",
                "Товщина лінії": "Товщина лінії",
                "Кількість променів": "Кількість променів",
                "Кількість кілець": "Кількість кілець",
                "Товщина кілець": "Товщина кілець",
                "Товщина променів": "Товщина променів",
                "Wobble (Хвилювання)": "Wobble (Хвилювання)",
                "Jitter (Джиттер)": "Jitter (Джиттер)",
                "Fractal (Фрактал)": "Fractal (Фрактал)",
                "Хвиля кілець: Амплітуда": "Хвиля кілець: Амплітуда",
                "Хвиля кілець: Частота": "Хвиля кілець: Частота",
                "Хвиля променів: Амплітуда": "Хвиля променів: Амплітуда",
                "Хвиля променів: Частота": "Хвиля променів: Частота",
                "Центр X (Position X)": "Центр X (Position X)",
                "Центр Y (Position Y)": "Центр Y (Position Y)",
                "Пропорції / Еліпсис": "Пропорції / Еліпсис",
                "Середня точка (Midpoint)": "Середня точка (Midpoint)",
                "Октави": "Октави",
                "Кількість рукавів (Arms)": "Кількість рукавів (Arms)",
                "Фаза зсуву": "Фаза зсуву",
                "Зсув X": "Зсув X",
                "Зсув Y": "Зсув Y",
                "Масштаб Шару (Zoom)": "Масштаб Шару (Zoom)",
                "Кут обертання (−180° … +180°)": "Кут обертання (−180° … +180°)",
                "Яскравість шару": "Яскравість шару",
                "Контраст шару": "Контраст шару",
                "Розмиття (px)": "Розмиття (px)",
                "Масштаб (Zoom)": "Масштаб (Zoom)",
                "Масштаб по X": "Масштаб по X",
                "Масштаб по Y": "Масштаб по Y",
                "Поворот": "Поворот",
                "Глобальна Яскравість": "Глобальна Яскравість",
                "Глобальний Контраст": "Глобальний Контраст",
                "Глобальне Розмиття": "Глобальне Розмиття",
                "Глобальна Віньєтка": "Глобальна Віньєтка",
                "Глобальне Зерно / Шум": "Глобальне Зерно / Шум",
                "Глобальна Гама": "Глобальна Гама",
                "Контраст": "Контраст",
                "Гамма": "Гамма",
                "Перспектива вертикальна": "Перспектива вертикальна",
                "Перспектива горизонтальна": "Перспектива горизонтальна",
                "Розмір точок": "Розмір точок",
                "М'якість країв": "М'якість країв",
                "Проміжок між пікселями (Gap)": "Проміжок між пікселями (Gap)",
                "Яскравість шва / проміжку": "Яскравість шва / проміжку",
                "М'якість країв шва": "М'якість країв шва",
                "Радіус скруглення кутів": "Радіус скруглення кутів",
                "Поріг бінарності (Threshold)": "Поріг бінарності (Threshold)",
                "Кількість рівнів (Steps)": "Кількість рівнів (Steps)",
                "Інтенсивність 3D фаски": "Інтенсивність 3D фаски",
                "Кут повороту хвилі": "Кут повороту хвилі",
                "Глобальна фаза (Phase)": "Глобальна фаза (Phase)",
                "Зсув фази X (°)": "Зсув фази X (°)",
                "Зсув фази Y (°)": "Зсув фази Y (°)",
                "Гострота / Потужність (Exp)": "Гострота / Потужність (Exp)",
                "Ширина імпульсу (Duty)": "Ширина імпульсу (Duty)",
                "Гармоніки / Октави": "Гармоніки / Октави",
                "Спад гармонік (Gain)": "Спад гармонік (Gain)",
                "Викривлення / Wobble": "Викривлення / Wobble",
                "Частота викривлення": "Частота викривлення",
                "Каскадність / Довжина хвоста (Cascade Length)": "Каскадність / Довжина хвоста (Cascade Length)",
                "Розтяжка тону / Спад (Tone Gradient Falloff)": "Розтяжка тону / Спад (Tone Gradient Falloff)",
                "Масштаб цифр та клітинки (Digit & Grid Scale)": "Масштаб цифр та клітинки (Digit & Grid Scale)",
                "Обертання символів (Char Rotation)": "Обертання символів (Char Rotation)",
                "Випадковий розкид кута (Rotation Randomness)": "Випадковий розкид кута (Rotation Randomness)"
            },
            en: {
                app_title: "Veil Studio — Procedural Texture Generator",
                logo_subtitle: "texture generator",
                badge_pro: "PRO 1.0",
                made_in_ukraine: "Made in Ukraine",
                made_in_ukraine_short: "UA",
                btn_reset: "↺ Reset",
                btn_reset_title: "Reset entire project to default state",
                btn_save: "💾 Save .veil",
                btn_save_title: "Download project to .veil file",
                btn_open: "📂 Open",
                btn_open_title: "Open project file (.veil / .json)",
                btn_projects: "⚙️ Projects",
                btn_projects_title: "Manage project & IDB slots",
                btn_benchmark: "⚡ Benchmark",
                btn_benchmark_title: "Run profiler and stress test",
                btn_export_png: "Export PNG",

                panel_layers: "Layers",
                btn_add_layer: "+ Layer",
                res_label: "Resolution:",
                render_label: "Render:",
                fps_label: "FPS:",
                scale_label: "Scale:",
                autosave_title: "Click to view saved projects",
                autosave_active: "Autosave: Active",
                redo_title: "Redo",
                undo_title: "Undo",
                zoom_in_title: "Zoom In",
                zoom_out_title: "Zoom Out",
                rotate_left_title: "Rotate Left",
                rotate_right_title: "Rotate Right",
                reset_view_title: "Reset View",
                res_selector_title: "Canvas Resolution",
                fast_preview_title: "Temporarily reduce resolution to 256x256 while dragging sliders",
                fast_preview_label: "Fast Preview",
                canvas_border_title: "Toggle border and effects around canvas",
                border_label: "Border",
                border_intensity_title: "Click to adjust intensity",
                border_intensity_label: "Intensity",

                title_layer_props: "Layer Properties",
                title_global_props: "Global Effects",
                title_tiling_props: "Seamless Tiling PRO",
                tab_layer: "Layer",
                tab_global: "Global",
                tab_tiling: "Tiling",

                confirm_title: "Confirmation",
                btn_cancel: "Cancel",
                btn_confirm: "Confirm",

                png_title: "Export PNG",
                png_res: "Resolution",
                png_instruction: "Long press the image and select 'Save to Photos' (mobile) or Right-click -> 'Save image as' (PC).",
                png_rendering: "Rendering...",
                btn_close: "Close",

                pm_title: "Veil Studio Project Manager",
                pm_tab_file: "💾 .veil File",
                pm_tab_idb: "⚡ Local Slots",
                pm_tab_text: "📝 Text Code",
                pm_rec_badge: "⭐ RECOMMENDED METHOD",
                pm_rec_desc: "Save your project as a compact .veil file to disk. All layers, geometry, and drawn masks are saved lossless and load instantly.",
                pm_download_veil: "Download Project File (.veil)",
                pm_open_veil: "Open Project File (.veil / .json)",
                pm_slot_placeholder: "Slot name (optional)...",
                pm_quick_save: "⚡ Quick Save",
                pm_saved_slots: "Saved slots in browser",
                pm_json_code: "Current Project Code (JSON)",
                pm_copy_clipboard: "Copy to Clipboard",
                pm_paste_label: "Paste project code from clipboard",
                pm_paste_placeholder: "Paste JSON code here...",
                pm_read_clipboard: "📋 Read Clipboard",
                pm_load: "Load",

                bench_title: "Profiler & Stress Test Benchmark",
                bench_fps_label: "FRAME TIME (FPS)",
                bench_mem_label: "HEAP MEMORY",
                bench_opt_label: "OPTIMIZATIONS",
                bench_opt_active: "6/6 Active",
                bench_run_title: "Automated Performance Stress Testing",
                bench_run_desc: "Runs comprehensive suite: speed test at 256/512/1024, load test with 5/10/20 layers, and 30 rapid deformer steps to evaluate memory usage.",
                bench_run_btn: "🚀 Run Full Stress Test",
                bench_report_title: "PERFORMANCE REPORT",
                bench_grade: "GRADE: A+",
                bench_res_label: "RENDER TIME BY RESOLUTION",
                bench_multi_label: "MULTI-LAYER LOAD",
                bench_stress_label: "DYNAMIC STRESS TEST (30 PARAMS)",
                bench_success_footer: "✓ All critical algorithms (Voronoi bitwise hash, sliding box blur, kernel pooling, TypedArray fast-path) verified and optimized!",

                layer_default_name: "Layer 1",
                new_layer_name: "New Layer",
                copy_suffix: "(Copy)",
                acc_algo: "Algorithm & Generator",
                acc_transform: "Transform & Scale",
                acc_fx: "Local Effects",
                acc_warps: "Deformers (Warps)",
                acc_gtform: "Global Transform",
                acc_gwarps: "Global Deformers (Warps)",
                acc_gtiling: "Global Tiling",
                acc_gfx: "Global Correction",
                reset_default_title: "Reset to default ({def})",
                reset_project_confirm: "Reset ENTIRE project to initial state? All layers and global settings will be lost.",
                reset_layer_confirm: "Reset all parameters of layer \"{name}\" to defaults?",
                reset_global_confirm: "Reset all global settings (corrections, transform, tiling) to default values?",
                drag_layer_tooltip: "Click and drag layer",
                hide_layer_tooltip: "Hide layer",
                show_layer_tooltip: "Show layer",
                mask_no_target_tooltip: "Mask: no target layer below",
                mask_target_tooltip: "This layer works as a mask for layer below",
                mask_badge: "MASK",
                use_as_mask_tooltip: "Use as mask",
                duplicate_layer_tooltip: "Duplicate layer",
                delete_layer_tooltip: "Delete layer",
                lbl_layer_name: "Layer Name",
                btn_reset_layer: "↺ Reset Layer",
                blend_mode_label: "Blend Mode",
                opacity_label: "Opacity (%)",

                "Розмір пензля": "Brush Size",
                "Інтервал (Крок)": "Interval / Spacing",
                "Сила (Непрозорість %)": "Strength (Opacity %)",
                "Зона м'якості": "Softness Zone",
                "Спад градієнта": "Gradient Falloff",
                "Кут нахилу пензля": "Brush Angle",
                "Форма (Стиснення)": "Shape (Squash)",
                "Частота": "Frequency",
                "Фаза": "Phase",
                "К-ть Джерел": "Source Count",
                "Симетрія": "Symmetry",
                "Товщина лінії": "Line Width",
                "Кількість променів": "Ray Count",
                "Кількість кілець": "Ring Count",
                "Товщина кілець": "Ring Thickness",
                "Товщина променів": "Ray Thickness",
                "Wobble (Хвилювання)": "Wobble",
                "Jitter (Джиттер)": "Jitter",
                "Fractal (Фрактал)": "Fractal",
                "Хвиля кілець: Амплітуда": "Ring Wave: Amplitude",
                "Хвиля кілець: Частота": "Ring Wave: Frequency",
                "Хвиля променів: Амплітуда": "Ray Wave: Amplitude",
                "Хвиля променів: Частота": "Ray Wave: Frequency",
                "Центр X (Position X)": "Center X",
                "Центр Y (Position Y)": "Center Y",
                "Пропорції / Еліпсис": "Aspect Ratio / Ellipsis",
                "Середня точка (Midpoint)": "Midpoint",
                "Октави": "Octaves",
                "Кількість рукавів (Arms)": "Arms Count",
                "Фаза зсуву": "Shift Phase",
                "Зсув X": "Offset X",
                "Зсув Y": "Offset Y",
                "Масштаб Шару (Zoom)": "Layer Scale (Zoom)",
                "Кут обертання (−180° … +180°)": "Rotation Angle (−180° … +180°)",
                "Яскравість шару": "Layer Brightness",
                "Контраст шару": "Layer Contrast",
                "Розмиття (px)": "Blur (px)",
                "Масштаб (Zoom)": "Global Zoom",
                "Масштаб по X": "Scale X",
                "Масштаб по Y": "Scale Y",
                "Поворот": "Global Rotation",
                "Глобальна Яскравість": "Global Brightness",
                "Глобальний Контраст": "Global Contrast",
                "Глобальне Розмиття": "Global Blur",
                "Глобальна Віньєтка": "Global Vignette",
                "Глобальне Зерно / Шум": "Global Grain / Noise",
                "Глобальна Гама": "Global Gamma",
                "Контраст": "Contrast",
                "Гамма": "Gamma",
                "Перспектива вертикальна": "Vertical Perspective",
                "Перспектива горизонтальна": "Horizontal Perspective",
                "Розмір точок": "Dot Size",
                "М'якість країв": "Edge Softness",
                "Проміжок між пікселями (Gap)": "Gap Between Pixels",
                "Яскравість шва / проміжку": "Gap / Seam Brightness",
                "М'якість країв шва": "Seam Edge Softness",
                "Радіус скруглення кутів": "Corner Rounding Radius",
                "Поріг бінарності (Threshold)": "Binary Threshold",
                "Кількість рівнів (Steps)": "Quantization Steps",
                "Інтенсивність 3D фаски": "3D Bevel Intensity",
                "Кут повороту хвилі": "Wave Rotation Angle",
                "Глобальна фаза (Phase)": "Global Phase",
                "Зсув фази X (°)": "Phase Offset X (°)",
                "Зсув фази Y (°)": "Phase Offset Y (°)",
                "Гострота / Потужність (Exp)": "Wave Sharpness / Power",
                "Ширина імпульсу (Duty)": "Pulse Width (Duty)",
                "Гармоніки / Октави": "Harmonics / Octaves",
                "Спад гармонік (Gain)": "Harmonics Falloff (Gain)",
                "Викривлення / Wobble": "Noise Distortion / Wobble",
                "Частота викривлення": "Distortion Frequency",
                "Каскадність / Довжина хвоста (Cascade Length)": "Cascade / Tail Length",
                "Розтяжка тону / Спад (Tone Gradient Falloff)": "Tone Gradient Falloff",
                "Масштаб цифр та клітинки (Digit & Grid Scale)": "Digit & Grid Scale",
                "Обертання символів (Char Rotation)": "Char Base Rotation",
                "Випадковий розкид кута (Rotation Randomness)": "Char Rotation Randomness"
            }
        };

        function t(key, replacements) {
            let str = (translations[currentLang] && translations[currentLang][key]) ||
                      (translations.uk && translations.uk[key]) || key;
            if (replacements) {
                for (const [k, v] of Object.entries(replacements)) {
                    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
                }
            }
            return str;
        }

        function setLanguage(lang) {
            if (lang !== 'uk' && lang !== 'en') lang = 'uk';
            currentLang = lang;
            localStorage.setItem('veil_language', lang);
            document.documentElement.lang = lang;

            const btnUA = $('langBtnUA');
            const btnEN = $('langBtnEN');
            if (btnUA && btnEN) {
                btnUA.classList.toggle('active', lang === 'uk');
                btnEN.classList.toggle('active', lang === 'en');
            }

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const k = el.getAttribute('data-i18n');
                if (k) el.textContent = t(k);
            });

            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                const k = el.getAttribute('data-i18n-title');
                if (k) el.title = t(k);
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const k = el.getAttribute('data-i18n-placeholder');
                if (k) el.placeholder = t(k);
            });

            if (typeof renderLayers === 'function') renderLayers();
            if (typeof renderStickyHeader === 'function') renderStickyHeader();
            if (typeof currentTab !== 'undefined' && typeof switchRightTab === 'function') switchRightTab(currentTab);
        }

        window.t = t;
        window.setLanguage = setLanguage;

        const viewport = {
            scale: 1, angle: 0, x: 0, y: 0, isDragging: false, startX: 0, startY: 0,
            update: function() {
                $('canvas').style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale}) rotate(${this.angle}deg)`;
                $('viewScaleInfo').innerText = Math.round(this.scale * 100) + '%';
            },
            zoom: function(delta) { this.scale = Math.max(0.1, this.scale + delta); this.update(); },
            rotate: function(deg) { this.angle += deg; this.update(); },
            reset: function() { this.scale = 1; this.angle = 0; this.x = 0; this.y = 0; this.update(); }
        };

        $('canvasWrapper').addEventListener('wheel', e => { e.preventDefault(); viewport.zoom(e.deltaY > 0 ? -0.1 : 0.1); });
        $('canvasWrapper').addEventListener('mousedown', e => {
            if (e.button === 0 && handleDeformerPointerDown(e)) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if(e.button === 1 || e.button === 2 || (e.button === 0 && e.shiftKey)) {
                viewport.isDragging = true; viewport.startX = e.clientX - viewport.x; viewport.startY = e.clientY - viewport.y;
            }
        });
        window.addEventListener('mousemove', e => {
            if (handleDeformerPointerMove(e)) return;
            if(viewport.isDragging) { viewport.x = e.clientX - viewport.startX; viewport.y = e.clientY - viewport.startY; viewport.update(); }
        });
        window.addEventListener('mouseup', () => {
            handleDeformerPointerUp();
            viewport.isDragging = false;
        });
        $('canvasWrapper').addEventListener('contextmenu', e => e.preventDefault());

        // --- iPad-жести на канвасі: pinch=zoom, 2 пальці=пан, поворот=обертання ---
        let activeTouchCount = 0;

        const touchGesture = { active:false, maxTouches:0, startTime:0, moved:false,
            startCenter:{x:0,y:0}, startDist:0, startAngle:0, startScale:1, startViewAngle:0, startViewX:0, startViewY:0 };

        function resetTouchGesture() {
            touchGesture.active = false;
            touchGesture.maxTouches = 0;
            touchGesture.moved = false;
            touchGesture.startTime = 0;
            activeTouchCount = 0;
        }

        function tCenter(touches){ let x=0,y=0; for(const t of touches){ x+=t.clientX; y+=t.clientY; } return {x:x/touches.length, y:y/touches.length}; }
        function tDist(touches){ if(touches.length<2) return 0; let dx=touches[0].clientX-touches[1].clientX, dy=touches[0].clientY-touches[1].clientY; return Math.hypot(dx,dy); }
        function tAngle(touches){ if(touches.length<2) return 0; return Math.atan2(touches[1].clientY-touches[0].clientY, touches[1].clientX-touches[0].clientX)*180/Math.PI; }

        const canvasWrapperEl = $('canvasWrapper');

        window.addEventListener('touchstart', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount > 1) { cancelPainting(); cancelStamping(); cancelMaskBrushing(); }
        }, {passive: true, capture: true});

        window.addEventListener('touchmove', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount > 1) { cancelPainting(); cancelStamping(); cancelMaskBrushing(); }
        }, {passive: true, capture: true});

        canvasWrapperEl.addEventListener('touchstart', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount >= 2) e.preventDefault(); // не дати сторінці зробити свій pinch-zoom/scroll
            if (activeTouchCount > 1) { cancelPainting(); cancelStamping(); cancelMaskBrushing(); }

            if (!touchGesture.active || touchGesture.maxTouches === 0) {
                touchGesture.active = true;
                touchGesture.maxTouches = activeTouchCount;
                touchGesture.moved = false;
                touchGesture.startTime = Date.now();
                touchGesture.startCenter = tCenter(e.touches);
            } else {
                touchGesture.maxTouches = Math.max(touchGesture.maxTouches, activeTouchCount);
            }

            if (e.touches.length >= 2) {
                touchGesture.startDist = tDist(e.touches);
                touchGesture.startAngle = tAngle(e.touches);
                touchGesture.startScale = viewport.scale;
                touchGesture.startViewAngle = viewport.angle;
                touchGesture.startViewX = viewport.x; touchGesture.startViewY = viewport.y;
                touchGesture.startCenter = tCenter(e.touches);
            }
        }, {passive:false});

        canvasWrapperEl.addEventListener('touchmove', e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (!touchGesture.active) return;
            if (e.touches.length >= 2) {
                e.preventDefault();
                cancelPainting(); cancelStamping(); cancelMaskBrushing();
                const c = tCenter(e.touches);
                const dx = c.x - touchGesture.startCenter.x, dy = c.y - touchGesture.startCenter.y;
                if (Math.hypot(dx,dy) > 8) touchGesture.moved = true;

                const dist = tDist(e.touches);
                if (touchGesture.startDist > 0) {
                    const factor = dist / touchGesture.startDist;
                    if (Math.abs(factor-1) > 0.03) touchGesture.moved = true;
                    viewport.scale = Math.max(0.1, Math.min(10, touchGesture.startScale * factor));
                }
                const angle = tAngle(e.touches);
                const angleDelta = angle - touchGesture.startAngle;
                if (Math.abs(angleDelta) > 3) touchGesture.moved = true;
                viewport.angle = touchGesture.startViewAngle + angleDelta;

                viewport.x = touchGesture.startViewX + dx;
                viewport.y = touchGesture.startViewY + dy;
                viewport.update();
            } else if (e.touches.length === 1) {
                const c = tCenter(e.touches);
                const dx = c.x - touchGesture.startCenter.x, dy = c.y - touchGesture.startCenter.y;
                if (Math.hypot(dx,dy) > 8) touchGesture.moved = true;
            }
        }, {passive:false});

        const handleCanvasTouchEnd = e => {
            activeTouchCount = e.touches ? e.touches.length : 0;
            if (activeTouchCount > 0) {
                if (activeTouchCount > 1) { cancelPainting(); cancelStamping(); cancelMaskBrushing(); }
                return;
            }

            if (touchGesture.active) {
                cancelPainting(); cancelStamping(); cancelMaskBrushing();
                resetTouchGesture();
            }
        };

        window.addEventListener('touchend', handleCanvasTouchEnd, {passive:true});
        window.addEventListener('touchcancel', handleCanvasTouchEnd, {passive:true});

        const mulberry32 = (seed) => {
            let s = seed % 2147483647;
            if (s <= 0) s += 2147483646;
            return function() {
                s = (s * 16807) % 2147483647;
                return (s - 1) / 2147483646;
            };
        };

        const Perlin = {
            p: new Uint8Array(512),
            init(seed = 1337) {
                let rng = mulberry32(seed);
                let a = new Uint8Array(256);
                for(let i=0;i<256;i++) a[i]=i;
                for(let i=255;i>0;i--){ let j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
                for(let i=0;i<512;i++) this.p[i]=a[i&255];
            },
            fade: t => t*t*t*(t*(t*6-15)+10),
            lerp: (t,a,b) => a+t*(b-a),
            grad(h,x,y){ let u=h<4?x:y, v=h<4?y:x; return ((h&1)?-u:u)+((h&2)?-2.0*v:2.0*v); },
            noise(x,y){
                let X=Math.floor(x)&255, Y=Math.floor(y)&255; x-=Math.floor(x); y-=Math.floor(y);
                let u=this.fade(x), v=this.fade(y), A=this.p[X]+Y, B=this.p[X+1]+Y;
                return this.lerp(v, this.lerp(u, this.grad(this.p[A],x,y), this.grad(this.p[B],x-1,y)),
                                    this.lerp(u, this.grad(this.p[A+1],x,y-1), this.grad(this.p[B+1],x-1,y-1)));
            }
        }; Perlin.init(1337);

        const Simplex = (function() {
            const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
            const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
            const F3 = 1.0 / 3.0;
            const G3 = 1.0 / 6.0;
            const F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
            const G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

            const grad2 = [
                [1,1], [-1,1], [1,-1], [-1,-1],
                [1,0], [-1,0], [0,1], [0,-1],
                [1,1], [-1,1], [1,-1], [-1,-1]
            ];

            const grad3 = [
                [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
            ];

            const grad4 = [
                [0,1,1,1], [0,1,1,-1], [0,1,-1,1], [0,1,-1,-1],
                [0,-1,1,1], [0,-1,1,-1], [0,-1,-1,1], [0,-1,-1,-1],
                [1,0,1,1], [1,0,1,-1], [1,0,-1,1], [1,0,-1,-1],
                [-1,0,1,1], [-1,0,1,-1], [-1,0,-1,1], [-1,0,-1,-1],
                [1,1,0,1], [1,1,0,-1], [1,-1,0,1], [1,-1,0,-1],
                [-1,1,0,1], [-1,1,0,-1], [-1,-1,0,1], [-1,-1,0,-1],
                [1,1,1,0], [1,1,-1,0], [1,-1,1,0], [1,-1,-1,0],
                [-1,1,1,0], [-1,1,-1,0], [-1,-1,1,0], [-1,-1,-1,0]
            ];

            const simplex4D = [
                [0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
                [0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
                [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
                [1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
                [1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
                [0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
                [2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
                [2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]
            ];

            const permCache = new Map();

            function getPerm(seed = 0) {
                let s = (seed | 0) & 0x7fffffff;
                if (permCache.has(s)) return permCache.get(s);

                let rng = mulberry32(s || 1337);
                let p = new Uint8Array(256);
                for (let i = 0; i < 256; i++) p[i] = i;
                for (let i = 255; i > 0; i--) {
                    let j = Math.floor(rng() * (i + 1));
                    let temp = p[i]; p[i] = p[j]; p[j] = temp;
                }

                let perm = new Uint8Array(512);
                let permMod12 = new Uint8Array(512);
                let permMod32 = new Uint8Array(512);
                for (let i = 0; i < 512; i++) {
                    let v = p[i & 255];
                    perm[i] = v;
                    permMod12[i] = v % 12;
                    permMod32[i] = v % 32;
                }

                let res = { perm, permMod12, permMod32 };
                if (permCache.size > 64) {
                    let firstKey = permCache.keys().next().value;
                    permCache.delete(firstKey);
                }
                permCache.set(s, res);
                return res;
            }

            function noise2D(xin, yin, seed = 0) {
                let { perm, permMod12 } = getPerm(seed);
                let s = (xin + yin) * F2;
                let i = Math.floor(xin + s);
                let j = Math.floor(yin + s);
                let t = (i + j) * G2;
                let X0 = i - t;
                let Y0 = j - t;
                let x0 = xin - X0;
                let y0 = yin - Y0;

                let i1, j1;
                if (x0 > y0) { i1 = 1; j1 = 0; }
                else { i1 = 0; j1 = 1; }

                let x1 = x0 - i1 + G2;
                let y1 = y0 - j1 + G2;
                let x2 = x0 - 1.0 + 2.0 * G2;
                let y2 = y0 - 1.0 + 2.0 * G2;

                let ii = i & 255;
                let jj = j & 255;

                let gi0 = permMod12[ii + perm[jj]];
                let gi1 = permMod12[ii + i1 + perm[jj + j1]];
                let gi2 = permMod12[ii + 1 + perm[jj + 1]];

                let n0 = 0, n1 = 0, n2 = 0;

                let t0 = 0.5 - x0 * x0 - y0 * y0;
                if (t0 > 0) {
                    t0 *= t0;
                    let g = grad2[gi0];
                    n0 = t0 * t0 * (g[0] * x0 + g[1] * y0);
                }

                let t1 = 0.5 - x1 * x1 - y1 * y1;
                if (t1 > 0) {
                    t1 *= t1;
                    let g = grad2[gi1];
                    n1 = t1 * t1 * (g[0] * x1 + g[1] * y1);
                }

                let t2 = 0.5 - x2 * x2 - y2 * y2;
                if (t2 > 0) {
                    t2 *= t2;
                    let g = grad2[gi2];
                    n2 = t2 * t2 * (g[0] * x2 + g[1] * y2);
                }

                return 70.0 * (n0 + n1 + n2);
            }

            function noise3D(xin, yin, zin, seed = 0) {
                let { perm, permMod12 } = getPerm(seed);
                let s = (xin + yin + zin) * F3;
                let i = Math.floor(xin + s);
                let j = Math.floor(yin + s);
                let k = Math.floor(zin + s);
                let t = (i + j + k) * G3;
                let X0 = i - t;
                let Y0 = j - t;
                let Z0 = k - t;
                let x0 = xin - X0;
                let y0 = yin - Y0;
                let z0 = zin - Z0;

                let i1, j1, k1;
                let i2, j2, k2;

                if (x0 >= y0) {
                    if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
                    else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
                    else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
                } else {
                    if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
                    else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
                    else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
                }

                let x1 = x0 - i1 + G3;
                let y1 = y0 - j1 + G3;
                let z1 = z0 - k1 + G3;
                let x2 = x0 - i2 + 2.0 * G3;
                let y2 = y0 - j2 + 2.0 * G3;
                let z2 = z0 - k2 + 2.0 * G3;
                let x3 = x0 - 1.0 + 3.0 * G3;
                let y3 = y0 - 1.0 + 3.0 * G3;
                let z3 = z0 - 1.0 + 3.0 * G3;

                let ii = i & 255;
                let jj = j & 255;
                let kk = k & 255;

                let gi0 = permMod12[ii + perm[jj + perm[kk]]];
                let gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
                let gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
                let gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

                let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

                let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
                if (t0 > 0) {
                    t0 *= t0;
                    let g = grad3[gi0];
                    n0 = t0 * t0 * (g[0]*x0 + g[1]*y0 + g[2]*z0);
                }
                let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
                if (t1 > 0) {
                    t1 *= t1;
                    let g = grad3[gi1];
                    n1 = t1 * t1 * (g[0]*x1 + g[1]*y1 + g[2]*z1);
                }
                let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
                if (t2 > 0) {
                    t2 *= t2;
                    let g = grad3[gi2];
                    n2 = t2 * t2 * (g[0]*x2 + g[1]*y2 + g[2]*z2);
                }
                let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
                if (t3 > 0) {
                    t3 *= t3;
                    let g = grad3[gi3];
                    n3 = t3 * t3 * (g[0]*x3 + g[1]*y3 + g[2]*z3);
                }

                return 32.0 * (n0 + n1 + n2 + n3);
            }

            function noise4D(x, y, z, w, seed = 0) {
                let { perm, permMod32 } = getPerm(seed);
                let s = (x + y + z + w) * F4;
                let i = Math.floor(x + s);
                let j = Math.floor(y + s);
                let k = Math.floor(z + s);
                let l = Math.floor(w + s);
                let t = (i + j + k + l) * G4;
                let X0 = i - t;
                let Y0 = j - t;
                let Z0 = k - t;
                let W0 = l - t;
                let x0 = x - X0;
                let y0 = y - Y0;
                let z0 = z - Z0;
                let w0 = w - W0;

                let c1 = (x0 > y0) ? 32 : 0;
                let c2 = (x0 > z0) ? 16 : 0;
                let c3 = (y0 > z0) ? 8 : 0;
                let c4 = (x0 > w0) ? 4 : 0;
                let c5 = (y0 > w0) ? 2 : 0;
                let c6 = (z0 > w0) ? 1 : 0;
                let c = c1 + c2 + c3 + c4 + c5 + c6;
                let sc = simplex4D[c] || [0, 0, 0, 0];

                let i1 = sc[0] >= 3 ? 1 : 0;
                let j1 = sc[1] >= 3 ? 1 : 0;
                let k1 = sc[2] >= 3 ? 1 : 0;
                let l1 = sc[3] >= 3 ? 1 : 0;

                let i2 = sc[0] >= 2 ? 1 : 0;
                let j2 = sc[1] >= 2 ? 1 : 0;
                let k2 = sc[2] >= 2 ? 1 : 0;
                let l2 = sc[3] >= 2 ? 1 : 0;

                let i3 = sc[0] >= 1 ? 1 : 0;
                let j3 = sc[1] >= 1 ? 1 : 0;
                let k3 = sc[2] >= 1 ? 1 : 0;
                let l3 = sc[3] >= 1 ? 1 : 0;

                let x1 = x0 - i1 + G4;
                let y1 = y0 - j1 + G4;
                let z1 = z0 - k1 + G4;
                let w1 = w0 - l1 + G4;

                let x2 = x0 - i2 + 2.0 * G4;
                let y2 = y0 - j2 + 2.0 * G4;
                let z2 = z0 - k2 + 2.0 * G4;
                let w2 = w0 - l2 + 2.0 * G4;

                let x3 = x0 - i3 + 3.0 * G4;
                let y3 = y0 - j3 + 3.0 * G4;
                let z3 = z0 - k3 + 3.0 * G4;
                let w3 = w0 - l3 + 3.0 * G4;

                let x4 = x0 - 1.0 + 4.0 * G4;
                let y4 = y0 - 1.0 + 4.0 * G4;
                let z4 = z0 - 1.0 + 4.0 * G4;
                let w4 = w0 - 1.0 + 4.0 * G4;

                let ii = i & 255;
                let jj = j & 255;
                let kk = k & 255;
                let ll = l & 255;

                let gi0 = permMod32[ii + perm[jj + perm[kk + perm[ll]]]];
                let gi1 = permMod32[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]];
                let gi2 = permMod32[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]];
                let gi3 = permMod32[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]];
                let gi4 = permMod32[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]];

                let n0 = 0, n1 = 0, n2 = 0, n3 = 0, n4 = 0;

                let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0 - w0*w0;
                if (t0 > 0) {
                    t0 *= t0;
                    let g = grad4[gi0];
                    n0 = t0 * t0 * (g[0]*x0 + g[1]*y0 + g[2]*z0 + g[3]*w0);
                }
                let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1 - w1*w1;
                if (t1 > 0) {
                    t1 *= t1;
                    let g = grad4[gi1];
                    n1 = t1 * t1 * (g[0]*x1 + g[1]*y1 + g[2]*z1 + g[3]*w1);
                }
                let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2 - w2*w2;
                if (t2 > 0) {
                    t2 *= t2;
                    let g = grad4[gi2];
                    n2 = t2 * t2 * (g[0]*x2 + g[1]*y2 + g[2]*z2 + g[3]*w2);
                }
                let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3 - w3*w3;
                if (t3 > 0) {
                    t3 *= t3;
                    let g = grad4[gi3];
                    n3 = t3 * t3 * (g[0]*x3 + g[1]*y3 + g[2]*z3 + g[3]*w3);
                }
                let t4 = 0.6 - x4*x4 - y4*y4 - z4*z4 - w4*w4;
                if (t4 > 0) {
                    t4 *= t4;
                    let g = grad4[gi4];
                    n4 = t4 * t4 * (g[0]*x4 + g[1]*y4 + g[2]*z4 + g[3]*w4);
                }

                return 27.0 * (n0 + n1 + n2 + n3 + n4);
            }

            function evalLayer(tx, ty, sx, sy, p = {}) {
                let seed = p.pixelSeed || p.seed || 0;
                let mode = p.simplexMode || 'standard';
                let octaves = Math.max(1, Math.min(10, p.octaves || 4));
                let lacunarity = p.lacunarity !== undefined ? p.lacunarity : 2.0;
                let gain = p.gain !== undefined ? p.gain : 0.5;
                let warpStr = p.warpStrength || 0;
                let warpFreq = p.warpFreq || 1.0;
                let ridgePower = p.ridgePower !== undefined ? p.ridgePower : 2.0;
                let isSeamless = p.seamless === true;

                let scaleFactorX = (sx || 10) / 10;
                let scaleFactorY = (sy || 10) / 10;

                let x = tx * scaleFactorX;
                let y = ty * scaleFactorY;

                if (warpStr > 0) {
                    let wx = noise2D(x * warpFreq, y * warpFreq, seed + 101);
                    let wy = noise2D(x * warpFreq + 5.2, y * warpFreq + 1.3, seed + 202);
                    x += wx * warpStr;
                    y += wy * warpStr;
                }

                const sampleSample = (qx, qy, curSeed) => {
                    if (isSeamless) {
                        let u = (qx % 1 + 1) % 1;
                        let v = (qy % 1 + 1) % 1;
                        let r1 = scaleFactorX / (2 * Math.PI);
                        let r2 = scaleFactorY / (2 * Math.PI);
                        let nx = Math.cos(u * 2 * Math.PI) * r1;
                        let ny = Math.sin(u * 2 * Math.PI) * r1;
                        let nz = Math.cos(v * 2 * Math.PI) * r2;
                        let nw = Math.sin(v * 2 * Math.PI) * r2;
                        return noise4D(nx, ny, nz, nw, curSeed);
                    } else {
                        return noise2D(qx, qy, curSeed);
                    }
                };

                if (mode === 'ridged') {
                    let val = 0, amp = 1, freq = 1, maxAmp = 0, weight = 1;
                    for (let i = 0; i < octaves; i++) {
                        let n = sampleSample(x * freq, y * freq, seed + i * 37);
                        n = 1.0 - Math.abs(n);
                        n = Math.pow(n, ridgePower);
                        n *= weight;
                        weight = Math.max(0, Math.min(1, n * 2));
                        val += n * amp;
                        maxAmp += amp;
                        amp *= gain;
                        freq *= lacunarity;
                    }
                    return Math.max(0, Math.min(1, val / maxAmp));
                } else if (mode === 'billow') {
                    let val = 0, amp = 1, freq = 1, maxAmp = 0;
                    for (let i = 0; i < octaves; i++) {
                        let n = Math.abs(sampleSample(x * freq, y * freq, seed + i * 37)) * 2 - 1;
                        val += n * amp;
                        maxAmp += amp;
                        amp *= gain;
                        freq *= lacunarity;
                    }
                    return Math.max(0, Math.min(1, (val / maxAmp + 1) * 0.5));
                } else if (mode === 'turbulence') {
                    let val = 0, amp = 1, freq = 1, maxAmp = 0;
                    for (let i = 0; i < octaves; i++) {
                        let n = Math.abs(sampleSample(x * freq, y * freq, seed + i * 37));
                        val += n * amp;
                        maxAmp += amp;
                        amp *= gain;
                        freq *= lacunarity;
                    }
                    return Math.max(0, Math.min(1, val / maxAmp));
                } else if (mode === 'swiss') {
                    let val = 0, amp = 1, freq = 1, maxAmp = 0;
                    let warpSumX = 0, warpSumY = 0;
                    for (let i = 0; i < octaves; i++) {
                        let n = sampleSample((x + warpSumX) * freq, (y + warpSumY) * freq, seed + i * 37);
                        n = 1.0 - Math.abs(n);
                        val += n * amp;
                        maxAmp += amp;
                        amp *= gain;
                        freq *= lacunarity;
                        warpSumX += n * amp * 0.5;
                        warpSumY += n * amp * 0.5;
                    }
                    return Math.max(0, Math.min(1, val / maxAmp));
                } else {
                    let val = 0, amp = 1, freq = 1, maxAmp = 0;
                    for (let i = 0; i < octaves; i++) {
                        let n = sampleSample(x * freq, y * freq, seed + i * 37);
                        val += n * amp;
                        maxAmp += amp;
                        amp *= gain;
                        freq *= lacunarity;
                    }
                    return Math.max(0, Math.min(1, (val / maxAmp + 1) * 0.5));
                }
            }

            return {
                noise: noise2D,
                noise2D,
                noise3D,
                noise4D,
                eval: evalLayer
            };
        })();

        const NoiseCache = {
            init() {},
            get(x, y) {
                return Simplex.noise(x / 20, y / 20);
            }
        };

        const Voronoi = {
            hash: (x, y) => {
                let n = (x * 1597334677 ^ y * 3812015801) >>> 0;
                n = (n ^ (n >>> 15)) * 1597334677;
                n = (n ^ (n >>> 13)) * 3812015801;
                return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
            },
            dist: (px,py,qx,qy,m,e) => {
                let dx=Math.abs(px-qx), dy=Math.abs(py-qy);
                if(m==='manhattan') return dx+dy; if(m==='chebyshev') return Math.max(dx,dy);
                if(m==='minkowski') return Math.pow(Math.pow(dx,e)+Math.pow(dy,e),1/e);
                return Math.sqrt(dx*dx+dy*dy);
            },
            noise(x,y,mode='f1',m='euclidean',e=2){
                let ix=Math.floor(x), iy=Math.floor(y), fx=x-ix, fy=y-iy;
                let d1=8, d2=8;
                for(let j=-1;j<=1;j++) for(let i=-1;i<=1;i++){
                    let px=i+this.hash(ix+i,iy+j), py=j+this.hash(ix+i+31,iy+j+47);
                    let d = this.dist(fx,fy,px,py,m,e);
                    if(d<d1){ d2=d1; d1=d; } else if(d<d2) d2=d;
                }
                return mode==='f2_minus_f1'?Math.abs(d2-d1):mode==='f2'?d2:d1;
            }
        };

        const Cymatics = {
            getSources(mode, count) {
                let s = [];
                switch (mode) {
                    case 'Center': s.push({x: 0, y: 0}); break;
                    case 'Corners': s.push({x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1}); break;
                    case 'Edges': s.push({x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}); break;
                    case 'Ring': 
                        for(let i=0; i<count; i++) { let a = (i/count) * Math.PI * 2; s.push({x: Math.cos(a)*0.5, y: Math.sin(a)*0.5}); } break;
                    case 'Polygon':
                        for(let i=0; i<count; i++) { let a = (i/count) * Math.PI * 2; s.push({x: Math.cos(a)*0.8, y: Math.sin(a)*0.8}); } break;
                    case 'Random':
                        for(let i=0; i<count; i++) { s.push({x: (Math.sin(i * 12.9898) * 43758.5453 % 1) * 2 - 1, y: (Math.sin(i * 78.233) * 43758.5453 % 1) * 2 - 1}); } break;
                }
                return s;
            },
            noise(x, y, p, precalculatedSources = null, scaleX = 10, scaleY = 10) {
                let scaleFactorX = (scaleX !== undefined ? scaleX : (p && p.scaleX !== undefined ? p.scaleX : 10)) / 10;
                let scaleFactorY = (scaleY !== undefined ? scaleY : (p && p.scaleY !== undefined ? p.scaleY : 10)) / 10;
                let sx = (x - 0.5) * 2 * scaleFactorX;
                let sy = (y - 0.5) * 2 * scaleFactorY;
                const symParam = p.symmetry || 1;
                if (symParam > 1) {
                    let angle = Math.atan2(sy, sx), radius = Math.sqrt(sx * sx + sy * sy), slice = (Math.PI * 2) / symParam;
                    angle = angle % slice; if (angle < 0) angle += slice;
                    if (angle > slice / 2) angle = slice - angle;
                    sx = Math.cos(angle) * radius; sy = Math.sin(angle) * radius;
                }
                let sum = 0;
                let sources = precalculatedSources || this.getSources(p.sourceMode||'Corners', p.sourcesCount||4);
                for (let i = 0; i < sources.length; i++) {
                    let s = sources[i];
                    let dx = sx - s.x, dy = sy - s.y;
                    sum += Math.sin(Math.sqrt(dx * dx + dy * dy) * (p.frequency||50)*0.1 + (p.phase||0) * (Math.PI / 180));
                }
                let thickness = 0.05 + (1 - (p.isolineWidth||0.5)) * 0.1;
                return Math.abs(sum / sources.length) < thickness ? 1 : 0;
            }
        };

        const ProceduralGradient = {
            eval(tx, ty, p, sx, sy) {
                let gradType = p.gradType || 'linear';
                let spreadMethod = p.spreadMethod || 'clamp';
                let cx = p.centerX !== undefined ? p.centerX : 0.5;
                let cy = p.centerY !== undefined ? p.centerY : 0.5;
                let angleRad = ((p.angle || 0) * Math.PI) / 180;
                let aspect = Math.max(0.01, p.aspectRatio || 1.0);
                let scaleX = (sx || 10) / 10;
                let scaleY = (sy || 10) / 10;

                // Relative position centered at (cx, cy)
                let dx = (tx - cx) * scaleX;
                let dy = (ty - cy) * scaleY;

                // Rotated coordinates
                let cosA = Math.cos(-angleRad);
                let sinA = Math.sin(-angleRad);
                let rx = dx * cosA - dy * sinA;
                let ry = dx * sinA + dy * cosA;

                let u = 0;
                switch (gradType) {
                    case 'linear':
                        u = rx + 0.5;
                        break;
                    case 'radial':
                        u = Math.sqrt(rx * rx + ry * ry) * 2;
                        break;
                    case 'elliptical':
                        u = Math.sqrt(rx * rx + (ry / aspect) * (ry / aspect)) * 2;
                        break;
                    case 'conical': {
                        let ang = Math.atan2(ry, rx);
                        u = (ang + Math.PI) / (2 * Math.PI);
                        break;
                    }
                    case 'reflected':
                        u = Math.abs(rx) * 2;
                        break;
                    case 'diamond':
                        u = (Math.abs(rx) + Math.abs(ry) / aspect) * 2;
                        break;
                    default:
                        u = rx + 0.5;
                }

                // Spread methods
                let t = 0;
                if (spreadMethod === 'clamp') {
                    t = Math.max(0, Math.min(1, u));
                } else if (spreadMethod === 'repeat') {
                    t = u - Math.floor(u);
                    if (t < 0) t += 1;
                } else if (spreadMethod === 'reflect') {
                    let fu = Math.abs(u);
                    let m = Math.floor(fu);
                    let rem = fu - m;
                    t = (m % 2 === 0) ? rem : (1 - rem);
                }

                // Midpoint shift curve
                let mid = p.midpoint !== undefined ? p.midpoint : 0.5;
                if (mid !== 0.5 && mid > 0 && mid < 1) {
                    let exp = Math.log(0.5) / Math.log(mid);
                    t = Math.pow(Math.max(0, Math.min(1, t)), exp);
                }

                // Evaluate color stops or return t
                if (p.stops && Array.isArray(p.stops) && p.stops.length > 0) {
                    if (!p._sortedStops || p._stopsDirty) {
                        p._sortedStops = p.stops.slice().sort((a, b) => a.pos - b.pos);
                        p._stopsDirty = false;
                    }
                    return this.evalStopsVal(t, p._sortedStops);
                }
                return Math.max(0, Math.min(1, t));
            },

            evalStopsVal(t, sortedStops) {
                if (!sortedStops || sortedStops.length === 0) return t;
                if (sortedStops.length === 1) return sortedStops[0].val !== undefined ? sortedStops[0].val : 1;

                if (t <= sortedStops[0].pos) return sortedStops[0].val !== undefined ? sortedStops[0].val : 0;
                if (t >= sortedStops[sortedStops.length - 1].pos) return sortedStops[sortedStops.length - 1].val !== undefined ? sortedStops[sortedStops.length - 1].val : 1;

                for (let i = 0; i < sortedStops.length - 1; i++) {
                    let s1 = sortedStops[i];
                    let s2 = sortedStops[i + 1];
                    if (t >= s1.pos && t <= s2.pos) {
                        let range = s2.pos - s1.pos;
                        let factor = range > 0 ? (t - s1.pos) / range : 0;
                        let v1 = s1.val !== undefined ? s1.val : s1.pos;
                        let v2 = s2.val !== undefined ? s2.val : s2.pos;
                        return v1 + (v2 - v1) * factor;
                    }
                }
                return t;
            }
        };

        const fbm = (x,y,oct,lac=2,gain=0.5,t='perlin') => {
            let v=0, a=1, f=1, max=0, fn=t==='simplex'?Simplex.noise.bind(Simplex):Perlin.noise.bind(Perlin);
            for(let i=0;i<oct;i++){ v+=a*(fn(x*f,y*f)+1)/2; max+=a; a*=gain; f*=lac; }
            return v/max;
        };

        const ridged = (x, y, oct, lac = 2, gain = 0.5, p = {}) => {
            let mode = p.ridgeMode || 'ridges';
            let noiseType = p.ridgeNoiseType || 'perlin';
            let exponent = p.ridgePower !== undefined ? p.ridgePower : 2.0;
            let offset = p.ridgeOffset !== undefined ? p.ridgeOffset : 1.0;
            let attenuation = p.ridgeAttenuation !== undefined ? p.ridgeAttenuation : 2.0;
            let isMulti = p.ridgeMultifractal !== false;
            let warpAmount = p.ridgeWarp || 0;
            let warpFreq = p.ridgeWarpFreq || 2.0;

            let noiseFn;
            if (noiseType === 'simplex') {
                noiseFn = (nx, ny) => (Simplex.noise(nx, ny) + 1) * 0.5;
            } else if (noiseType === 'value') {
                noiseFn = (nx, ny) => {
                    let ix = Math.floor(nx), iy = Math.floor(ny), fx = nx - ix, fy = ny - iy;
                    let u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
                    let h00 = Voronoi.hash(ix, iy), h10 = Voronoi.hash(ix + 1, iy);
                    let h01 = Voronoi.hash(ix, iy + 1), h11 = Voronoi.hash(ix + 1, iy + 1);
                    return (1 - v) * ((1 - u) * h00 + u * h10) + v * ((1 - u) * h01 + u * h11);
                };
            } else if (noiseType === 'cellular') {
                noiseFn = (nx, ny) => Voronoi.noise(nx, ny, 'f1', 'euclidean');
            } else {
                noiseFn = (nx, ny) => (Perlin.noise(nx, ny) + 1) * 0.5;
            }

            let px = x, py = y;
            if (warpAmount > 0) {
                let wx = Perlin.noise(x * warpFreq, y * warpFreq);
                let wy = Perlin.noise(x * warpFreq + 15.3, y * warpFreq + 31.7);
                px += wx * warpAmount;
                py += wy * warpAmount;
            }

            let value = 0;
            let weight = 1.0;
            let amplitude = 1.0;
            let frequency = 1.0;
            let maxVal = 0;

            for (let i = 0; i < oct; i++) {
                let sampleX = px * frequency;
                let sampleY = py * frequency;

                let rawN = noiseFn(sampleX, sampleY);
                let n = offset - Math.abs(rawN * 2.0 - 1.0);
                n = Math.max(0, n);

                if (exponent !== 1.0) {
                    n = Math.pow(n, exponent);
                }

                if (isMulti) {
                    n *= weight;
                    weight = Math.min(1.0, Math.max(0.0, n * attenuation));
                }

                value += n * amplitude;
                maxVal += amplitude;

                amplitude *= gain;
                frequency *= lac;
            }

            let normVal = value / (maxVal || 1);

            if (mode === 'valleys') {
                normVal = 1.0 - normVal;
            } else if (mode === 'dual') {
                normVal = Math.abs(1.0 - normVal * 2.0);
            } else if (mode === 'sharp_valley') {
                normVal = Math.pow(1.0 - normVal, 2.0);
            }

            return Math.max(0, Math.min(1, normVal));
        };

        const SinusoidGenerator = {
            evalWaveform(angle, profile, duty = 0.5) {
                let norm = angle / (Math.PI * 2);
                norm = norm - Math.floor(norm);
                if (norm < 0) norm += 1;

                switch (profile) {
                    case 'cosine':
                        return (Math.cos(angle) + 1) * 0.5;
                    case 'triangle':
                        return Math.abs(norm - 0.5) * 2;
                    case 'square':
                        return norm < duty ? 1.0 : 0.0;
                    case 'absolute':
                        return Math.abs(Math.sin(angle));
                    case 'sawtooth':
                        return norm;
                    case 'sine':
                    default:
                        return (Math.sin(angle) + 1) * 0.5;
                }
            },

            evalHarmonicWave(coord, phase, octaves, gain, profile, duty) {
                let val = 0;
                let amp = 1.0;
                let freq = 1.0;
                let maxAmp = 0;

                for (let o = 0; o < octaves; o++) {
                    let a = coord * Math.PI * 2 * freq + phase * (o + 1);
                    val += amp * this.evalWaveform(a, profile, duty);
                    maxAmp += amp;
                    amp *= gain;
                    freq *= 2.0;
                }
                return val / (maxAmp || 1);
            },

            eval(tx, ty, sx, sy, p) {
                let mode = p.sineMode || 'cross_add';
                let profile = p.sineProfile || 'sine';
                let angleDeg = p.sineAngle || 0;
                let rad = (angleDeg * Math.PI) / 180;

                let globalPhase = (p.phase || 0);
                let phaseX = ((p.sinePhaseX || 0) * Math.PI) / 180 + globalPhase;
                let phaseY = ((p.sinePhaseY || 0) * Math.PI) / 180 + globalPhase;

                let sharpness = p.sineSharpness !== undefined ? p.sineSharpness : 1.0;
                let duty = p.sineDuty !== undefined ? p.sineDuty : 0.5;

                let octaves = Math.max(1, Math.min(8, p.sineOctaves || 1));
                let gain = p.sineGain !== undefined ? p.sineGain : 0.5;

                let wobble = p.sineWobble || 0;
                let wobbleFreq = p.sineWobbleFreq || 5.0;

                let cx = p.centerX !== undefined ? p.centerX : 0.5;
                let cy = p.centerY !== undefined ? p.centerY : 0.5;

                let scaleX = (sx || 10);
                let scaleY = (sy || 10);

                let dx = (tx - cx) * scaleX;
                let dy = (ty - cy) * scaleY;

                let cosA = Math.cos(rad);
                let sinA = Math.sin(rad);

                let rx = dx * cosA - dy * sinA;
                let ry = dx * sinA + dy * cosA;

                if (wobble > 0) {
                    let nX = Perlin.noise(tx * wobbleFreq, ty * wobbleFreq);
                    let nY = Perlin.noise(tx * wobbleFreq + 100, ty * wobbleFreq + 100);
                    rx += nX * wobble;
                    ry += nY * wobble;
                }

                let v = 0.5;

                switch (mode) {
                    case 'horizontal':
                        v = this.evalHarmonicWave(rx, phaseX, octaves, gain, profile, duty);
                        break;
                    case 'vertical':
                        v = this.evalHarmonicWave(ry, phaseY, octaves, gain, profile, duty);
                        break;
                    case 'grid_mult': {
                        let vx = this.evalHarmonicWave(rx, phaseX, octaves, gain, profile, duty);
                        let vy = this.evalHarmonicWave(ry, phaseY, octaves, gain, profile, duty);
                        v = vx * vy;
                        break;
                    }
                    case 'diagonal':
                        v = this.evalHarmonicWave(rx + ry, phaseX, octaves, gain, profile, duty);
                        break;
                    case 'radial': {
                        let dist = Math.sqrt(rx * rx + ry * ry);
                        v = this.evalHarmonicWave(dist, phaseX, octaves, gain, profile, duty);
                        break;
                    }
                    case 'hex': {
                        let v1 = this.evalHarmonicWave(rx, phaseX, octaves, gain, profile, duty);
                        let v2 = this.evalHarmonicWave(rx * 0.5 + ry * 0.866025, phaseX, octaves, gain, profile, duty);
                        let v3 = this.evalHarmonicWave(rx * 0.5 - ry * 0.866025, phaseX, octaves, gain, profile, duty);
                        v = (v1 + v2 + v3) / 3.0;
                        break;
                    }
                    case 'cross_max': {
                        let vx = this.evalHarmonicWave(rx, phaseX, octaves, gain, profile, duty);
                        let vy = this.evalHarmonicWave(ry, phaseY, octaves, gain, profile, duty);
                        v = Math.max(vx, vy);
                        break;
                    }
                    case 'cross_diff': {
                        let vx = this.evalHarmonicWave(rx, phaseX, octaves, gain, profile, duty);
                        let vy = this.evalHarmonicWave(ry, phaseY, octaves, gain, profile, duty);
                        v = Math.abs(vx - vy);
                        break;
                    }
                    case 'cross_add':
                    default: {
                        let vx = this.evalHarmonicWave(rx, phaseX, octaves, gain, profile, duty);
                        let vy = this.evalHarmonicWave(ry, phaseY, octaves, gain, profile, duty);
                        v = (vx + vy) * 0.5;
                        break;
                    }
                }

                if (sharpness !== 1.0 && sharpness > 0) {
                    v = Math.pow(Math.max(0, Math.min(1, v)), sharpness);
                }

                return Math.max(0, Math.min(1, v));
            }
        };

        const HeartbeatGenerator = {
            hashLine(i, seed) {
                let n = Math.sin(i * 12.9898 + (seed || 0) * 78.233) * 43758.5453;
                return n - Math.floor(n);
            },

            evalPulseShape(t, pulseType, pulseWidth) {
                let u = t - Math.floor(t);
                if (u < 0) u += 1.0;

                let w = Math.max(0.01, pulseWidth || 0.2);
                let x = (u - 0.5) / w;

                if (Math.abs(x) > 2.5) return 0.0;

                switch (pulseType) {
                    case 'ecg': {
                        let pWave = 0.18 * Math.exp(-Math.pow(x + 1.1, 2) * 10);
                        let qWave = -0.22 * Math.exp(-Math.pow(x + 0.35, 2) * 45);
                        let rWave = 1.0 * Math.exp(-Math.pow(x, 2) * 80);
                        let sWave = -0.35 * Math.exp(-Math.pow(x - 0.35, 2) * 45);
                        let tWave = 0.28 * Math.exp(-Math.pow(x - 1.1, 2) * 12);
                        let uWave = 0.08 * Math.exp(-Math.pow(x - 1.8, 2) * 20);
                        return pWave + qWave + rWave + sWave + tWave + uWave;
                    }
                    case 'pulse': {
                        return 1.0 / (1.0 + Math.pow(x * 6, 2));
                    }
                    case 'sine_burst': {
                        return Math.sin(x * 12.57) * Math.exp(-Math.pow(x, 2) * 2.5);
                    }
                    case 'triangle': {
                        let absX = Math.abs(x);
                        return absX <= 1.0 ? (1.0 - absX) : 0.0;
                    }
                    case 'square': {
                        return Math.abs(x) <= 0.8 ? 1.0 : 0.0;
                    }
                    case 'noise_glitch': {
                        let stepX = Math.floor(x * 8) / 8;
                        let h = Math.sin(stepX * 17.3 + 3.1) * 0.5 + 0.5;
                        return Math.abs(x) <= 1.2 ? h * (1.0 - Math.abs(x) / 1.2) : 0.0;
                    }
                    default:
                        return 1.0 * Math.exp(-Math.pow(x, 2) * 50);
                }
            },

            eval(tx, ty, sx, sy, p) {
                let orientation = p.hbOrientation || 'horizontal';
                let lineCount = p.hbLineCount !== undefined ? p.hbLineCount : 5;
                let lineThickness = p.hbThickness !== undefined ? p.hbThickness : 0.02;
                let lineStyle = p.hbLineStyle || 'smooth';
                let pixelSize = p.hbPixelSize !== undefined ? p.hbPixelSize : 8;
                let waveType = p.hbWaveType || 'ecg';
                let amplitude = p.hbAmplitude !== undefined ? p.hbAmplitude : 0.35;
                let beatsFreq = p.hbBeatsFreq !== undefined ? p.hbBeatsFreq : 4.0;
                let pulseWidth = p.hbPulseWidth !== undefined ? p.hbPulseWidth : 0.2;
                let distortFreq = p.hbDistortFreq !== undefined ? p.hbDistortFreq : 3.0;
                let distortAmp = p.hbDistortAmp !== undefined ? p.hbDistortAmp : 0.08;
                let layersCount = p.hbLayers !== undefined ? p.hbLayers : 2;
                let jitter = p.hbJitter !== undefined ? p.hbJitter : 0.15;
                let softness = p.hbSoftness !== undefined ? p.hbSoftness : 0.005;
                let bipolar = p.hbBipolar || 'unipolar';
                let angleDeg = p.hbAngle || 0;
                let seed = p.seed || 0;

                let cx = p.centerX !== undefined ? p.centerX : 0.5;
                let cy = p.centerY !== undefined ? p.centerY : 0.5;
                let scaleFactorX = (sx !== undefined ? sx : 10) / 10;
                let scaleFactorY = (sy !== undefined ? sy : 10) / 10;

                let dx = (tx - cx) * scaleFactorX;
                let dy = (ty - cy) * scaleFactorY;

                let u = dx + cx;
                let v = dy + cy;

                if (orientation === 'vertical') {
                    u = dy + cy;
                    v = dx + cx;
                } else if (orientation === 'angled') {
                    let rad = (angleDeg * Math.PI) / 180;
                    let cosA = Math.cos(rad);
                    let sinA = Math.sin(rad);
                    let rx = dx * cosA - dy * sinA;
                    let ry = dx * sinA + dy * cosA;
                    u = rx + cx;
                    v = ry + cy;
                }

                if (lineStyle === 'pixelated' && pixelSize > 1) {
                    let pGrid = pixelSize * 32;
                    u = Math.floor(u * pGrid) / pGrid;
                    v = Math.floor(v * pGrid) / pGrid;
                }

                const calcPass = (uCoord, vCoord) => {
                    let passVal = 0.0;
                    for (let i = 0; i < lineCount; i++) {
                        let h0 = this.hashLine(i, seed);
                        let h1 = this.hashLine(i + 100, seed);
                        let h2 = this.hashLine(i + 200, seed);
                        let h3 = this.hashLine(i + 300, seed);

                        let spacing = 1.0 / (lineCount + 1);
                        let baseLinePos = (i + 1) * spacing + (h0 - 0.5) * spacing * jitter;

                        let lineBeatFreq = beatsFreq * Math.max(0.05, 1.0 + (h1 - 0.5) * jitter * 0.5);
                        let phaseOffset = h2 * 10.0 * (1.0 + jitter * 0.5);

                        let noiseVal = 0;
                        if (distortAmp > 0.001) {
                            if (typeof Simplex !== 'undefined' && Simplex.noise2D) {
                                noiseVal = Simplex.noise2D(uCoord * distortFreq * scaleFactorX + i * 3.7, seed * 0.1) * distortAmp;
                            } else {
                                noiseVal = Math.sin(uCoord * distortFreq * Math.PI * 2 + i) * distortAmp;
                            }
                        }

                        let curveDisplacement = 0;
                        for (let l = 0; l < layersCount; l++) {
                            let layerWeight = 1.0 / Math.pow(1.5, l);
                            let layerFreqMult = Math.pow(1.618, l);
                            let layerPhase = phaseOffset + l * 1.337;

                            let posInBeat = uCoord * lineBeatFreq * layerFreqMult + layerPhase;
                            let pVal = this.evalPulseShape(posInBeat, waveType, pulseWidth / Math.sqrt(l + 1));

                            if (bipolar === 'bipolar' && (l % 2 === 1)) {
                                pVal = -pVal;
                            }

                            curveDisplacement += pVal * amplitude * layerWeight;
                        }

                        if (bipolar === 'absolute') {
                            curveDisplacement = Math.abs(curveDisplacement);
                        }

                        let Y_curve = baseLinePos + curveDisplacement + noiseVal;
                        let distToCurve = Math.abs(vCoord - Y_curve);

                        let lineIntensity = 0.0;
                        let lineThickMult = jitter > 0 ? Math.max(0.1, 1.0 + (h3 - 0.5) * Math.min(2.0, jitter * 0.5)) : 1.0;
                        let thick = lineThickness * lineThickMult * 0.5;

                        if (lineStyle === 'pixelated') {
                            lineIntensity = distToCurve <= thick ? 1.0 : 0.0;
                        } else if (lineStyle === 'dots') {
                            let dotPattern = (Math.sin(uCoord * lineBeatFreq * Math.PI * 8) > 0.0) ? 1.0 : 0.0;
                            let smoothEdge = 1.0 - smoothstep(thick - softness, thick + softness, distToCurve);
                            lineIntensity = smoothEdge * dotPattern;
                        } else if (lineStyle === 'glow') {
                            let core = 1.0 - smoothstep(thick - softness, thick, distToCurve);
                            let halo = Math.exp(-distToCurve / (thick * 4.0 + 0.0001));
                            lineIntensity = Math.max(core, halo * 0.7);
                        } else {
                            lineIntensity = 1.0 - smoothstep(thick - softness, thick + softness, distToCurve);
                        }

                        passVal = Math.max(passVal, lineIntensity);
                    }
                    return passVal;
                };

                let totalValue = 0.0;
                if (orientation === 'cross') {
                    let passH = calcPass(u, v);
                    let passV = calcPass(v, u);
                    totalValue = Math.max(passH, passV);
                } else {
                    totalValue = calcPass(u, v);
                }

                return Math.max(0, Math.min(1, totalValue));
            }
        };

        const MatrixDigitGenerator = {
            BITMAPS: {
                '0': [14, 17, 19, 21, 25, 17, 14],
                '1': [4, 12, 4, 4, 4, 4, 14],
                '2': [14, 17, 1, 2, 4, 8, 31],
                '3': [31, 2, 4, 2, 1, 17, 14],
                '4': [2, 6, 10, 18, 31, 2, 2],
                '5': [31, 16, 30, 1, 1, 17, 14],
                '6': [14, 17, 16, 30, 17, 17, 14],
                '7': [31, 1, 2, 4, 8, 8, 8],
                '8': [14, 17, 17, 14, 17, 17, 14],
                '9': [14, 17, 17, 15, 1, 17, 14],
                'A': [14, 17, 17, 31, 17, 17, 17],
                'B': [30, 17, 17, 30, 17, 17, 30],
                'C': [14, 17, 16, 16, 16, 17, 14],
                'D': [28, 18, 17, 17, 17, 18, 28],
                'E': [31, 16, 16, 30, 16, 16, 31],
                'F': [31, 16, 16, 30, 16, 16, 16],
                'G': [14, 17, 16, 23, 17, 17, 14],
                'H': [17, 17, 17, 31, 17, 17, 17],
                'I': [14, 4, 4, 4, 4, 4, 14],
                'J': [7, 2, 2, 2, 2, 18, 12],
                'K': [17, 18, 20, 24, 20, 18, 17],
                'L': [16, 16, 16, 16, 16, 16, 31],
                'M': [17, 27, 21, 21, 17, 17, 17],
                'N': [17, 25, 25, 21, 19, 19, 17],
                'O': [14, 17, 17, 17, 17, 17, 14],
                'P': [30, 17, 17, 30, 16, 16, 16],
                'Q': [14, 17, 17, 17, 21, 18, 13],
                'R': [30, 17, 17, 30, 20, 18, 17],
                'S': [14, 17, 16, 14, 1, 17, 14],
                'T': [31, 4, 4, 4, 4, 4, 4],
                'U': [17, 17, 17, 17, 17, 17, 14],
                'V': [17, 17, 17, 17, 17, 10, 4],
                'W': [17, 17, 17, 21, 21, 27, 17],
                'X': [17, 17, 10, 4, 10, 17, 17],
                'Y': [17, 17, 17, 10, 4, 4, 4],
                'Z': [31, 1, 2, 4, 8, 16, 31],
                '+': [0, 4, 4, 31, 4, 4, 0],
                '-': [0, 0, 0, 31, 0, 0, 0],
                '*': [0, 17, 10, 4, 10, 17, 0],
                '=': [0, 0, 31, 0, 31, 0, 0],
                '?': [14, 17, 1, 2, 4, 0, 4],
                '!': [4, 4, 4, 4, 4, 0, 4],
                '#': [10, 10, 31, 10, 31, 10, 10]
            },

            DYNAMIC_BITMAPS: new Map(),

            getCharBitmap(ch) {
                if (!ch) ch = '0';
                if (ch === ' ') {
                    return [0, 0, 0, 0, 0, 0, 0];
                }
                if (this.DYNAMIC_BITMAPS.has(ch)) {
                    return this.DYNAMIC_BITMAPS.get(ch);
                }

                let upper = ch.toUpperCase();
                if (this.BITMAPS[ch]) {
                    this.DYNAMIC_BITMAPS.set(ch, this.BITMAPS[ch]);
                    return this.BITMAPS[ch];
                }
                if (this.BITMAPS[upper]) {
                    this.DYNAMIC_BITMAPS.set(ch, this.BITMAPS[upper]);
                    return this.BITMAPS[upper];
                }

                // High-precision normalized 10x14 -> 5x7 bitmap generator for any custom character
                try {
                    let offCanvas = document.createElement('canvas');
                    offCanvas.width = 10;
                    offCanvas.height = 14;
                    let ctx = offCanvas.getContext('2d', { willReadFrequently: true });
                    if (ctx) {
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(0, 0, 10, 14);
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 11px monospace, sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(ch, 5, 7);

                        let imgData = ctx.getImageData(0, 0, 10, 14);
                        let data = imgData.data;
                        let rows = new Array(7).fill(0);

                        for (let y = 0; y < 7; y++) {
                            let rowMask = 0;
                            for (let x = 0; x < 5; x++) {
                                let srcX = x * 2;
                                let srcY = y * 2;
                                let sum = 0;
                                for (let dy = 0; dy < 2; dy++) {
                                    for (let dx = 0; dx < 2; dx++) {
                                        let idx = ((srcY + dy) * 10 + (srcX + dx)) * 4;
                                        sum += data[idx];
                                    }
                                }
                                if (sum > 140) {
                                    rowMask |= (1 << (4 - x));
                                }
                            }
                            rows[y] = rowMask;
                        }
                        this.DYNAMIC_BITMAPS.set(ch, rows);
                        return rows;
                    }
                } catch (e) {
                    console.warn('Error generating dynamic char bitmap for:', ch, e);
                }

                let fallback = this.BITMAPS['0'];
                this.DYNAMIC_BITMAPS.set(ch, fallback);
                return fallback;
            },

            eval7Segment(cx, cy, digit, glow) {
                const segMap = {
                    '0': [1,1,1,1,1,1,0],
                    '1': [0,1,1,0,0,0,0],
                    '2': [1,1,0,1,1,0,1],
                    '3': [1,1,1,1,0,0,1],
                    '4': [0,1,1,0,0,1,1],
                    '5': [1,0,1,1,0,1,1],
                    '6': [1,0,1,1,1,1,1],
                    '7': [1,1,1,0,0,0,0],
                    '8': [1,1,1,1,1,1,1],
                    '9': [1,1,1,1,0,1,1],
                    'A': [1,1,1,0,1,1,1],
                    'B': [0,0,1,1,1,1,1],
                    'C': [1,0,0,1,1,1,0],
                    'D': [0,1,1,1,1,0,1],
                    'E': [1,0,0,1,1,1,1],
                    'F': [1,0,0,0,1,1,1]
                };
                let active = segMap[digit] || segMap['8'];
                let thickness = 0.08;
                let len = 0.35;

                let segs = [
                    {x: 0.5, y: 0.15, w: len, h: thickness, act: active[0]},
                    {x: 0.82, y: 0.325, w: thickness, h: len, act: active[1]},
                    {x: 0.82, y: 0.675, w: thickness, h: len, act: active[2]},
                    {x: 0.5, y: 0.85, w: len, h: thickness, act: active[3]},
                    {x: 0.18, y: 0.675, w: thickness, h: len, act: active[4]},
                    {x: 0.18, y: 0.325, w: thickness, h: len, act: active[5]},
                    {x: 0.5, y: 0.5, w: len, h: thickness, act: active[6]}
                ];

                let isInsideAny = false;
                let minDist = 999;
                for (let i = 0; i < 7; i++) {
                    let s = segs[i];
                    if (!s.act) continue;
                    let dx = Math.max(0, Math.abs(cx - s.x) - s.w * 0.5);
                    let dy = Math.max(0, Math.abs(cy - s.y) - s.h * 0.5);
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < minDist) minDist = dist;

                    if (Math.abs(cx - s.x) < s.w * 0.5 && Math.abs(cy - s.y) < s.h * 0.5) {
                        isInsideAny = true;
                    }
                }

                if (isInsideAny) return 1.0;
                if (glow > 0.001) {
                    let sigma = 0.02 + 0.06 * Math.min(2.5, glow);
                    let gaussianGlow = Math.exp(-(minDist * minDist) / (2.0 * sigma * sigma));
                    let val = gaussianGlow * Math.min(1.2, glow * 0.75);
                    return val > 0.005 ? val : 0.0;
                }
                return 0.0;
            },

            eval(tx, ty, sx, sy, p) {
                let charSet = p.matrixCharSet || 'binary';
                let customChars = (p.matrixCustomChars !== undefined && p.matrixCustomChars !== '') ? p.matrixCustomChars : 'love';
                let wordMode = p.matrixWordMode || 'sequence';
                let density = p.matrixDensity !== undefined ? p.matrixDensity : 0.75;
                let cloudNoise = p.matrixCloudNoise !== undefined ? p.matrixCloudNoise : 0.5;
                let cloudFreq = p.matrixCloudFreq !== undefined ? p.matrixCloudFreq : 3.0;
                let digitScale = p.matrixDigitScale !== undefined ? p.matrixDigitScale : 1.0;
                let spacing = p.matrixSpacing !== undefined ? p.matrixSpacing : 0.0;
                let digitStyle = p.matrixDigitStyle || 'pixel_5x7';
                let glow = p.matrixGlow !== undefined ? p.matrixGlow : 0.2;
                let headGlow = p.matrixHeadGlow !== undefined ? p.matrixHeadGlow : 0.3;
                let jitter = p.matrixJitter !== undefined ? p.matrixJitter : 0.15;
                let seed = p.matrixSeed || 0;
                let rainSpeed = p.matrixRainSpeed !== undefined ? p.matrixRainSpeed : 0.0;
                let gridType = p.matrixGridType || 'standard';
                let direction = p.matrixDirection || 'top_down';
                let charAngle = p.matrixCharAngle !== undefined ? p.matrixCharAngle : 0;
                let charAngleJitter = p.matrixCharAngleJitter !== undefined ? p.matrixCharAngleJitter : 0;

                // Cascade controls:
                let cascadeLen = p.matrixCascade !== undefined ? p.matrixCascade : 12;
                let cascadeFade = p.matrixCascadeFade !== undefined ? p.matrixCascadeFade : 1.0;

                // Correlated Scale & Grid Cell size
                let effScaleX = (sx || 20) / Math.max(0.1, digitScale);
                let effScaleY = (sy || 20) / Math.max(0.1, digitScale);

                let gx = tx * effScaleX;
                let gy = ty * effScaleY;

                let rawRow = Math.floor(gy);
                let rawCol = Math.floor(gx);

                // Grid staggering math:
                if (gridType === 'staggered_h' && Math.abs(rawRow) % 2 === 1) {
                    gx += 0.5;
                } else if (gridType === 'staggered_v' && Math.abs(rawCol) % 2 === 1) {
                    gy += 0.5;
                }

                let ix = Math.floor(gx);
                let iyBase = Math.floor(gy);

                // Movement direction primary & secondary coordinates
                let primaryCoord = iyBase;
                let secondaryCoord = ix;
                let streamSign = 1;

                if (direction === 'bottom_up') {
                    primaryCoord = iyBase;
                    secondaryCoord = ix;
                    streamSign = -1;
                } else if (direction === 'left_right') {
                    primaryCoord = ix;
                    secondaryCoord = iyBase;
                    streamSign = 1;
                } else if (direction === 'right_left') {
                    primaryCoord = ix;
                    secondaryCoord = iyBase;
                    streamSign = -1;
                }

                let colOffset = 0;
                if (rainSpeed > 0) {
                    let speedFactor = rainSpeed * 10.0;
                    colOffset = Math.floor(Voronoi.hash(secondaryCoord * 17 + seed * 31, 101) * speedFactor);
                }

                let iy = iyBase + (direction === 'top_down' || direction === 'bottom_up' ? colOffset : 0);
                let ixWithOffset = ix + (direction === 'left_right' || direction === 'right_left' ? colOffset : 0);

                let fx = gx - Math.floor(gx);
                let fy = gy - Math.floor(gy);

                // Rotate character inside cell with optional random rotation jitter
                let effAngle = charAngle;
                if (charAngleJitter > 0) {
                    let rotHash = Voronoi.hash(ix * 509 + seed * 991, iy * 701 + seed * 43);
                    let randOffset = (rotHash * 2.0 - 1.0) * charAngleJitter;
                    effAngle += randOffset;
                }

                if (effAngle !== 0) {
                    let rad = (effAngle * Math.PI) / 180;
                    let cosA = Math.cos(rad);
                    let sinA = Math.sin(rad);
                    let dx = fx - 0.5;
                    let dy = fy - 0.5;
                    let rfx = dx * cosA - dy * sinA + 0.5;
                    let rfy = dx * sinA + dy * cosA + 0.5;
                    if (rfx < 0.0 || rfx > 1.0 || rfy < 0.0 || rfy > 1.0) {
                        return 0.0;
                    }
                    fx = rfx;
                    fy = rfy;
                }

                // Correlated Spacing / Cell padding
                if (spacing > 0.001) {
                    let halfGap = spacing * 0.45;
                    if (fx < halfGap || fx > (1.0 - halfGap) || fy < halfGap || fy > (1.0 - halfGap)) {
                        return 0.0;
                    }
                    fx = (fx - halfGap) / (1.0 - spacing * 0.9);
                    fy = (fy - halfGap) / (1.0 - spacing * 0.9);
                }

                // Cloud noise & density calculation
                let cloudVal = 1.0;
                if (cloudNoise > 0.001) {
                    let n = (Simplex.noise(ix * 0.05 * cloudFreq + seed * 10, iy * 0.05 * cloudFreq + seed * 20) + 1.0) * 0.5;
                    cloudVal = n;
                }

                let finalThreshold = (1.0 - cloudNoise) * density + cloudNoise * cloudVal * density;

                // Cell presence check (directly controlled by Density & Cloud Noise)
                let cellHash = Voronoi.hash(ix * 1013 + seed * 17, iy * 31337 + seed * 53);
                if (cellHash > finalThreshold) {
                    return 0.0;
                }

                // Cascade & Tone Falloff calculation
                let cascadeMod = 1.0;
                let isHead = false;

                if (cascadeLen > 0) {
                    let colStreamSeed = Voronoi.hash(secondaryCoord * 73 + seed * 991, 313);
                    let streamLen = Math.max(cascadeLen + 4, Math.floor(12 + colStreamSeed * 20));
                    let headOffset = Math.floor(colStreamSeed * 1000 + colOffset);
                    let curPrimary = (direction === 'left_right' || direction === 'right_left') ? ix : iyBase;
                    let relativePrimary = streamSign > 0 ? (curPrimary - headOffset) : (headOffset - curPrimary);
                    let streamPos = ((relativePrimary % streamLen) + streamLen) % streamLen;

                    if (streamPos === 0) {
                        isHead = true;
                        cascadeMod = 1.0 + headGlow * 2.0;
                    } else if (streamPos <= cascadeLen) {
                        let tailFraction = streamPos / cascadeLen;
                        let fade = Math.pow(1.0 - tailFraction, cascadeFade);
                        cascadeMod = 0.05 + 0.95 * fade;
                    } else {
                        cascadeMod = 0.03;
                    }
                }

                // Available character set selection
                let availableChars = ['0', '1'];
                if (charSet === 'digits') {
                    availableChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                } else if (charSet === 'hex') {
                    availableChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
                } else if (charSet === 'matrix_kanji') {
                    availableChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', '+', '-', '*', '=', '?', '!', '#'];
                } else if (charSet === 'custom') {
                    availableChars = customChars.split('');
                    if (availableChars.length === 0) availableChars = ['l', 'o', 'v', 'e'];
                }

                let ch = '0';
                if (charSet === 'custom' && wordMode === 'sequence') {
                    let seqCoord = (direction === 'left_right' || direction === 'right_left') ? ix : iy;
                    let charIdx = ((seqCoord) % availableChars.length + availableChars.length) % availableChars.length;
                    ch = availableChars[charIdx];
                } else {
                    let charHash = Voronoi.hash(ix * 307 + seed * 991, iy * 409 + seed * 733);
                    let charIdx = Math.floor(charHash * availableChars.length) % availableChars.length;
                    ch = availableChars[charIdx];
                }

                let cx = fx;
                let cy = fy;

                let val = 0.0;
                if (digitStyle === 'digital_7seg') {
                    val = this.eval7Segment(cx, cy, ch, glow);
                } else {
                    let rows = this.getCharBitmap(ch);
                    let gridW = 5;
                    let gridH = 7;
                    if (digitStyle === 'pixel_3x5') {
                        gridW = 3;
                        gridH = 5;
                    }

                    let px = Math.floor(cx * gridW);
                    let py = Math.floor(cy * gridH);

                    let isOn = false;
                    if (px >= 0 && px < gridW && py >= 0 && py < gridH) {
                        let rowBitmask = rows[Math.min(rows.length - 1, Math.floor((py / gridH) * rows.length))];
                        let bitIndex = 4 - Math.min(4, Math.floor((px / gridW) * 5));
                        if ((rowBitmask & (1 << bitIndex)) !== 0) {
                            isOn = true;
                        }
                    }

                    if (isOn) {
                        val = 1.0;
                    } else if (glow > 0.001) {
                        let minDist = 999;
                        for (let by = 0; by < gridH; by++) {
                            let rowBitmask = rows[Math.min(rows.length - 1, Math.floor((by / gridH) * rows.length))];
                            for (let bx = 0; bx < gridW; bx++) {
                                let bitIndex = 4 - Math.min(4, Math.floor((bx / gridW) * 5));
                                if ((rowBitmask & (1 << bitIndex)) !== 0) {
                                    let bitMinX = bx / gridW;
                                    let bitMaxX = (bx + 1) / gridW;
                                    let bitMinY = by / gridH;
                                    let bitMaxY = (by + 1) / gridH;

                                    let dx = 0;
                                    if (cx < bitMinX) dx = bitMinX - cx;
                                    else if (cx > bitMaxX) dx = cx - bitMaxX;

                                    let dy = 0;
                                    if (cy < bitMinY) dy = bitMinY - cy;
                                    else if (cy > bitMaxY) dy = cy - bitMaxY;

                                    let d = Math.sqrt(dx * dx + dy * dy);
                                    if (d < minDist) minDist = d;
                                }
                            }
                        }

                        if (minDist < 900) {
                            let sigma = 0.02 + 0.05 * Math.min(2.5, glow);
                            let gaussianGlow = Math.exp(-(minDist * minDist) / (2.0 * sigma * sigma));
                            val = gaussianGlow * Math.min(1.2, glow * 0.75);
                            if (val < 0.005) val = 0.0;
                        }
                    }
                }

                let brightnessMod = cascadeMod;
                if (isHead && headGlow > 0) {
                    brightnessMod = 1.5 + headGlow * 3.0;
                }

                if (jitter > 0) {
                    let jHash = Voronoi.hash(ix * 133 + seed * 19, iy * 199 + seed * 23);
                    brightnessMod *= Math.max(0.05, 1.0 + (jHash - 0.5) * jitter * 2.0);
                }

                val *= brightnessMod;

                if (isHead && headGlow > 0) {
                    let headCore = Math.exp(-((fx - 0.5) * (fx - 0.5) + (fy - 0.5) * (fy - 0.5)) * 8.0);
                    val = Math.max(val, headCore * headGlow * 0.8);
                }

                return Math.max(0, Math.min(3.0, val));
            }
        };

        const smoothstep = (edge0, edge1, x) => {
            let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
            return t * t * (3 - 2 * t);
        };

        // Глобальний тайлінг: перетворення координати в межах одного періоду.
        // wrapFold — чисте повторення (період 1, розрив на межі, якщо генератор не періодичний).
        // mirrorFold — дзеркальне складання (період 2, ЗАВЖДИ безшовне на межі, незалежно від генератора).
        const wrapFold = t => { t = t % 1; if (t < 0) t += 1; return t; };
        const mirrorFold = t => { t = t % 2; if (t < 0) t += 2; if (t > 1) t = 2 - t; return t; };

        let currentTab = 'layer', canvas, ctx;
        let canvasResolution = parseInt(localStorage.getItem('veil_canvas_resolution')) || 512;
        let lowResOnEdit = (function() {
            try {
                let saved = localStorage.getItem('veil_low_res_on_edit');
                return saved !== null ? saved === 'true' : true;
            } catch(e) {
                return true;
            }
        })();
        let showCanvasBorder = localStorage.getItem('veil_show_canvas_border') !== 'false';
        let canvasBorderIntensity = parseFloat(localStorage.getItem('veil_canvas_border_intensity'));
        if (isNaN(canvasBorderIntensity)) canvasBorderIntensity = 1.0;
        let b_width=0, b_height=0, blendBuffer, layerBuffer, blurTemp, dispBuffer, pendingMaskTargetBuffer, pendingMaskAlphaBuffer;

        function setCanvasRes(res, markDirty = true) {
            let cv = canvas || $('canvas');
            if (cv) {
                if (cv.width !== res || cv.height !== res) {
                    cv.width = res;
                    cv.height = res;
                    if (markDirty && state && state.layers) {
                        state.layers.forEach(l => { l.isDirty = true; });
                    }
                    if (typeof ensureBuffers === 'function') {
                        ensureBuffers(res, res);
                    }
                }
            }
        }
        window.setCanvasRes = setCanvasRes;



        function ensureBuffers(w, h) {
            if (b_width !== w || b_height !== h) {
                b_width = w; b_height = h;
                if (dispBuffer && dispBuffer.length !== w * h) {
                    dispBuffer = null;
                }
            }
            if (!dispBuffer || dispBuffer.length !== w * h) {
                dispBuffer = new Float32Array(w * h);
            }
        }

        function freeHighResGlobalBuffers() {
            if (window._globalFloatBuffers) {
                for (let name in window._globalFloatBuffers) {
                    delete window._globalFloatBuffers[name];
                }
            }
            if (dispBuffer && dispBuffer.length > 1024 * 1024) {
                dispBuffer = null;
                b_width = 0; b_height = 0;
            }
        }
        window.freeHighResGlobalBuffers = freeHighResGlobalBuffers;

        class CanvasDeformerManager {
            constructor(canvas = null, initialImageData = null) {
                this.canvas = canvas;
                this.sourceImageData = initialImageData;
                this.points = [];
                this.activePointIndex = -1;
                this.showOverlay = true;
            }

            addPoint(point = {}) {
                const defaultPoint = {
                    id: 'pt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                    x: 256,
                    y: 256,
                    type: 'inflate',   // 'inflate' | 'deflate' | 'twist' | 'push' | 'wave'
                    falloff: 'smooth', // 'smooth' | 'linear' | 'sharp' | 'ring'
                    radius: 100,
                    strength: 0.5,
                    angle: 0
                };
                const pt = { ...defaultPoint, ...point };
                this.points.push(pt);
                this.activePointIndex = this.points.length - 1;
                return pt;
            }

            removePoint(index) {
                if (index >= 0 && index < this.points.length) {
                    this.points.splice(index, 1);
                    if (this.activePointIndex >= this.points.length) {
                        this.activePointIndex = this.points.length - 1;
                    }
                }
            }

            updatePoint(index, key, val) {
                if (this.points[index]) {
                    this.points[index][key] = (key === 'type' || key === 'falloff' || key === 'id') ? val : parseFloat(val);
                }
            }

            static evaluatePoint(x, y, pt, canvasW = 512, canvasH = 512) {
                let scaleFactor = canvasW / 512;
                let ptX = (pt.x !== undefined ? pt.x : 256) * scaleFactor;
                let ptY = (pt.y !== undefined ? pt.y : 256) * scaleFactor;
                let r = (pt.radius || 100) * scaleFactor;

                let dx = x - ptX;
                let dy = y - ptY;
                let d = Math.hypot(dx, dy);

                if (d > r || r <= 0) return { x, y };

                let normDist = d / r;
                let factor = 0;
                const falloff = pt.falloff || 'smooth';

                if (falloff === 'linear') {
                    factor = 1 - normDist;
                } else if (falloff === 'sharp') {
                    let t = 1 - normDist;
                    factor = t * t * t;
                } else if (falloff === 'ring') {
                    factor = Math.sin(normDist * Math.PI);
                } else { // 'smooth' (smoothstep)
                    let t = 1 - normDist;
                    factor = t * t * (3 - 2 * t);
                }

                let strength = pt.strength !== undefined ? pt.strength : 0.5;
                let srcX = x;
                let srcY = y;
                let type = pt.type || 'inflate';

                if (type === 'inflate') {
                    let scale = 1 - (strength * factor);
                    srcX = ptX + dx * scale;
                    srcY = ptY + dy * scale;
                } else if (type === 'deflate') {
                    let scale = 1 + (strength * factor);
                    srcX = ptX + dx * scale;
                    srcY = ptY + dy * scale;
                } else if (type === 'twist') {
                    let theta = factor * strength * Math.PI;
                    let cosT = Math.cos(theta);
                    let sinT = Math.sin(theta);
                    srcX = ptX + (dx * cosT - dy * sinT);
                    srcY = ptY + (dx * sinT + dy * cosT);
                } else if (type === 'push') {
                    let rad = (pt.angle || 0) * Math.PI / 180;
                    let shift = strength * factor * (r * 0.5);
                    srcX = x - Math.cos(rad) * shift;
                    srcY = y - Math.sin(rad) * shift;
                } else if (type === 'wave') {
                    let wave = Math.sin(normDist * Math.PI * 8) * strength * 10 * scaleFactor * factor;
                    if (d > 0) {
                        srcX = x + (dx / d) * wave;
                        srcY = y + (dy / d) * wave;
                    }
                }

                return { x: srcX, y: srcY };
            }

            static transformPointArray(x, y, points, canvasW = 512, canvasH = 512) {
                let curX = x;
                let curY = y;
                if (!points || !points.length) return { x, y };

                for (let i = 0; i < points.length; i++) {
                    let pt = points[i];
                    if (pt.disabled) continue;
                    let res = CanvasDeformerManager.evaluatePoint(curX, curY, pt, canvasW, canvasH);
                    curX = res.x;
                    curY = res.y;
                }
                return { x: curX, y: curY };
            }

            static applyZoomStretch(nx, ny, w) {
                let zcx = w.centerX !== undefined ? Number(w.centerX) : 0.5;
                let zcy = w.centerY !== undefined ? Number(w.centerY) : 0.5;
                let zst = (w.strength !== undefined ? Number(w.strength) : 50) / 100;
                let zrad = (w.radius !== undefined ? Number(w.radius) : 500) / 512;
                let zinnerR = (w.innerRadius !== undefined ? Number(w.innerRadius) : 0) / 512;
                let zpow = w.power !== undefined ? Number(w.power) : 1.0;
                let ztw = (w.twist !== undefined ? Number(w.twist) : 0) * Math.PI / 180;
                let zfalloff = w.falloff || 'zoom_rays';
                let ztileWrap = w.tileWrap || 'none';

                let zdx = nx - zcx;
                let zdy = ny - zcy;
                let zd = Math.sqrt(zdx * zdx + zdy * zdy);

                if (zd <= zinnerR || zd <= 0.00001) return { nx, ny };

                let effD = zd - zinnerR;
                let effRad = Math.max(0.0001, zrad - zinnerR);
                let normD = effD / effRad;
                let weight = 1.0;

                if (zfalloff === 'zoom_rays' || zfalloff === 'linear') {
                    weight = normD;
                } else if (zfalloff === 'full' || zfalloff === 'constant') {
                    weight = 1.0;
                } else if (zfalloff === 'smooth') {
                    weight = Math.exp(-normD * normD * 0.5);
                } else if (zfalloff === 'exponential') {
                    weight = normD * normD;
                } else if (zfalloff === 'spherical') {
                    weight = Math.sqrt(Math.max(0.0001, normD));
                }

                if (zpow !== 1.0 && weight > 0) {
                    weight = Math.pow(weight, zpow);
                }

                // Smooth radial spatial scale mapping - no tile cuts or grid segment artifacts
                let zoomFactor = zst * weight;
                let scale = 1.0;

                if (zoomFactor >= 0) {
                    scale = 1.0 / (1.0 + zoomFactor);
                } else {
                    scale = 1.0 - zoomFactor;
                }

                let rx = zdx * scale;
                let ry = zdy * scale;

                if (ztw !== 0) {
                    let twistAngle = ztw * weight;
                    let cosA = Math.cos(twistAngle);
                    let sinA = Math.sin(twistAngle);
                    let trx = rx * cosA - ry * sinA;
                    let try_ = rx * sinA + ry * cosA;
                    rx = trx;
                    ry = try_;
                }

                let outX = zcx + rx;
                let outY = zcy + ry;

                if (ztileWrap === 'wrap') {
                    outX = ((outX % 1) + 1) % 1;
                    outY = ((outY % 1) + 1) % 1;
                } else if (ztileWrap === 'clamp') {
                    outX = Math.max(0, Math.min(1, outX));
                    outY = Math.max(0, Math.min(1, outY));
                } else if (ztileWrap === 'mirror') {
                    let mx = Math.floor(outX);
                    let my = Math.floor(outY);
                    outX = (mx % 2 === 0) ? (outX - mx) : (1 - (outX - mx));
                    outY = (my % 2 === 0) ? (outY - my) : (1 - (outY - my));
                }

                return { nx: outX, ny: outY };
            }

            applyDeformationsToImageData(sourceImageData, targetImageData) {
                const w = sourceImageData.width;
                const h = sourceImageData.height;
                const srcData = sourceImageData.data;
                const tgtData = targetImageData.data;

                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        const targetIdx = (y * w + x) * 4;
                        const pos = CanvasDeformerManager.transformPointArray(x, y, this.points, w, h);
                        const srcX = pos.x;
                        const srcY = pos.y;

                        const x0 = Math.floor(srcX);
                        const x1 = Math.min(x0 + 1, w - 1);
                        const y0 = Math.floor(srcY);
                        const y1 = Math.min(y0 + 1, h - 1);

                        const dx = srcX - x0;
                        const dy = srcY - y0;

                        const clampedX0 = Math.max(0, Math.min(w - 1, x0));
                        const clampedX1 = Math.max(0, Math.min(w - 1, x1));
                        const clampedY0 = Math.max(0, Math.min(h - 1, y0));
                        const clampedY1 = Math.max(0, Math.min(h - 1, y1));

                        const idx00 = (clampedY0 * w + clampedX0) * 4;
                        const idx10 = (clampedY0 * w + clampedX1) * 4;
                        const idx01 = (clampedY1 * w + clampedX0) * 4;
                        const idx11 = (clampedY1 * w + clampedX1) * 4;

                        const w00 = (1 - dx) * (1 - dy);
                        const w10 = dx * (1 - dy);
                        const w01 = (1 - dx) * dy;
                        const w11 = dx * dy;

                        for (let c = 0; c < 4; c++) {
                            tgtData[targetIdx + c] = Math.round(
                                srcData[idx00 + c] * w00 +
                                srcData[idx10 + c] * w10 +
                                srcData[idx01 + c] * w01 +
                                srcData[idx11 + c] * w11
                            );
                        }
                    }
                }
                return targetImageData;
            }
        }
        window.CanvasDeformerManager = CanvasDeformerManager;

        // --- Drag state and helpers for Point Deformer handles ---
        let deformerDragState = {
            isDragging: false,
            isGlobal: false,
            warpIndex: -1,
            pointIndex: -1
        };

        function handleDeformerPointerDown(e) {
            let cv = (typeof canvas !== 'undefined' && canvas) || $('canvas');
            if (!cv) return false;

            let rect = cv.getBoundingClientRect();
            if (!rect || rect.width === 0) return false;

            let clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            let clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

            let normX = (clientX - rect.left) / rect.width;
            let normY = (clientY - rect.top) / rect.height;

            if (normX < 0 || normX > 1 || normY < 0 || normY > 1) return false;

            let canX = normX * 512;
            let canY = normY * 512;

            let hitFound = false;

            const checkWarpHits = (warps, isGlobal) => {
                if (hitFound || !warps) return;
                for (let wIdx = 0; wIdx < warps.length; wIdx++) {
                    let w = warps[wIdx];
                    if (w.visible === false || w.showHandles === false) continue;

                    if (w.type === 'point_deformer' && w.points) {
                        for (let pIdx = 0; pIdx < w.points.length; pIdx++) {
                            let pt = w.points[pIdx];
                            let dist = Math.hypot(canX - pt.x, canY - pt.y);
                            if (dist <= 18) {
                                hitFound = true;
                                deformerDragState.isDragging = true;
                                deformerDragState.warpType = 'point_deformer';
                                deformerDragState.isGlobal = isGlobal;
                                deformerDragState.warpIndex = wIdx;
                                deformerDragState.pointIndex = pIdx;
                                w.activePointIndex = pIdx;

                                if (isGlobal) renderGlobal();
                                else renderProps();
                                requestRender();
                                return;
                            }
                        }
                    } else if (w.type === 'zoom_stretch') {
                        let cxPos = (w.centerX !== undefined ? w.centerX : 0.5) * 512;
                        let cyPos = (w.centerY !== undefined ? w.centerY : 0.5) * 512;
                        let dist = Math.hypot(canX - cxPos, canY - cyPos);
                        if (dist <= 18) {
                            hitFound = true;
                            deformerDragState.isDragging = true;
                            deformerDragState.warpType = 'zoom_stretch';
                            deformerDragState.isGlobal = isGlobal;
                            deformerDragState.warpIndex = wIdx;

                            if (isGlobal) renderGlobal();
                            else renderProps();
                            requestRender();
                            return;
                        }
                    }
                }
            };

            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (lay && lay.visible && lay.params && lay.params.warps) {
                checkWarpHits(lay.params.warps, false);
            }
            if (!hitFound && state.global && state.global.warps) {
                checkWarpHits(state.global.warps, true);
            }

            return hitFound;
        }

        function handleDeformerPointerMove(e) {
            if (!deformerDragState.isDragging) return false;

            let cv = (typeof canvas !== 'undefined' && canvas) || $('canvas');
            if (!cv) return false;

            let rect = cv.getBoundingClientRect();
            if (!rect || rect.width === 0) return false;

            let clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            let clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

            let normX = (clientX - rect.left) / rect.width;
            let normY = (clientY - rect.top) / rect.height;

            let canX = Math.round(Math.max(0, Math.min(512, normX * 512)));
            let canY = Math.round(Math.max(0, Math.min(512, normY * 512)));

            let isGlobal = deformerDragState.isGlobal;
            let wIdx = deformerDragState.warpIndex;
            let pIdx = deformerDragState.pointIndex;

            let w = isGlobal ? (state.global.warps && state.global.warps[wIdx]) : (state.selectedLayerId && state.layers.find(l => l.id === state.selectedLayerId)?.params?.warps?.[wIdx]);
            if (w && w.type === 'zoom_stretch') {
                w.centerX = canX / 512;
                w.centerY = canY / 512;

                if (isGlobal) {
                    invalidateCaches();
                    renderGlobal();
                } else {
                    let lay = state.layers.find(l => l.id === state.selectedLayerId);
                    if (lay) lay.isDirty = true;
                    renderProps();
                }

                requestRender();
                return true;
            } else if (w && w.points && w.points[pIdx]) {
                w.points[pIdx].x = canX;
                w.points[pIdx].y = canY;

                if (isGlobal) {
                    invalidateCaches();
                } else {
                    let lay = state.layers.find(l => l.id === state.selectedLayerId);
                    if (lay) lay.isDirty = true;
                }

                let idPrefix = isGlobal ? 'glob' : 'lay';
                let xNum = $(`num_${idPrefix}_pt_x_${wIdx}_${pIdx}`);
                let xRng = $(`rng_${idPrefix}_pt_x_${wIdx}_${pIdx}`);
                if (xNum) xNum.value = canX;
                if (xRng) xRng.value = canX;

                let yNum = $(`num_${idPrefix}_pt_y_${wIdx}_${pIdx}`);
                let yRng = $(`rng_${idPrefix}_pt_y_${wIdx}_${pIdx}`);
                if (yNum) yNum.value = canY;
                if (yRng) yRng.value = canY;

                requestRender();
            }
            return true;
        }

        function handleDeformerPointerUp() {
            if (deformerDragState.isDragging) {
                deformerDragState.isDragging = false;
                commitHistorySnapshot();
                return true;
            }
            return false;
        }

        window.addPointToDeformer = function(isGlobal, warpIdx) {
            let w = isGlobal ? (state.global.warps && state.global.warps[warpIdx]) : (state.selectedLayerId && state.layers.find(l=>l.id===state.selectedLayerId)?.params?.warps?.[warpIdx]);
            if (!w) return;
            if (!w.points) w.points = [];
            
            let pCount = w.points.length;
            let offsetX = (pCount % 3 - 1) * 40;
            let offsetY = (Math.floor(pCount / 3) % 3 - 1) * 40;

            w.points.push({
                id: 'pt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                x: Math.min(480, Math.max(32, 256 + offsetX)),
                y: Math.min(480, Math.max(32, 256 + offsetY)),
                type: 'inflate',
                falloff: 'smooth',
                radius: 120,
                strength: 0.5,
                angle: 0
            });
            w.activePointIndex = w.points.length - 1;

            if (isGlobal) {
                invalidateCaches();
                renderGlobal();
            } else {
                let lay = state.layers.find(l=>l.id===state.selectedLayerId);
                if (lay) lay.isDirty = true;
                renderProps();
            }
            requestRender();
            commitHistorySnapshot();
        };

        window.removePointFromDeformer = function(isGlobal, warpIdx, pointIdx) {
            let w = isGlobal ? (state.global.warps && state.global.warps[warpIdx]) : (state.selectedLayerId && state.layers.find(l=>l.id===state.selectedLayerId)?.params?.warps?.[warpIdx]);
            if (!w || !w.points) return;
            w.points.splice(pointIdx, 1);
            if (w.activePointIndex >= w.points.length) {
                w.activePointIndex = w.points.length - 1;
            }

            if (isGlobal) {
                invalidateCaches();
                renderGlobal();
            } else {
                let lay = state.layers.find(l=>l.id===state.selectedLayerId);
                if (lay) lay.isDirty = true;
                renderProps();
            }
            requestRender();
            commitHistorySnapshot();
        };

        window.updateDeformerPoint = function(isGlobal, warpIdx, pointIdx, key, val) {
            let w = isGlobal ? (state.global.warps && state.global.warps[warpIdx]) : (state.selectedLayerId && state.layers.find(l=>l.id===state.selectedLayerId)?.params?.warps?.[warpIdx]);
            if (!w || !w.points || !w.points[pointIdx]) return;
            triggerInteraction();

            let parsedVal = (key === 'type' || key === 'falloff' || key === 'id') ? val : parseFloat(val);
            w.points[pointIdx][key] = parsedVal;
            w.activePointIndex = pointIdx;

            if (isGlobal) {
                invalidateCaches();
                if (key === 'type' || key === 'falloff') renderGlobal();
            } else {
                let lay = state.layers.find(l=>l.id===state.selectedLayerId);
                if (lay) lay.isDirty = true;
                if (key === 'type' || key === 'falloff') renderProps();
            }
            if (!suppressRender) requestRender();

            if (key === 'type' || key === 'falloff') {
                commitHistorySnapshot();
            } else {
                scheduleHistorySnapshot();
            }
        };

        window.toggleDeformerHandles = function(isGlobal, warpIdx, show) {
            let w = isGlobal ? (state.global.warps && state.global.warps[warpIdx]) : (state.selectedLayerId && state.layers.find(l=>l.id===state.selectedLayerId)?.params?.warps?.[warpIdx]);
            if (!w) return;
            w.showHandles = !!show;
            requestRender();
        };

        window.toggleDeformerPointExpanded = function(isGlobal, warpIdx, pointIdx) {
            let w = isGlobal ? (state.global.warps && state.global.warps[warpIdx]) : (state.selectedLayerId && state.layers.find(l=>l.id===state.selectedLayerId)?.params?.warps?.[warpIdx]);
            if (!w || !w.points || !w.points[pointIdx]) return;

            let pt = w.points[pointIdx];
            pt.expanded = pt.expanded === undefined ? false : !pt.expanded;
            w.activePointIndex = pointIdx;

            if (isGlobal) renderGlobal();
            else renderProps();
            requestRender();
        };

        window.setActiveDeformerPoint = function(isGlobal, warpIdx, pointIdx) {
            let w = isGlobal ? (state.global.warps && state.global.warps[warpIdx]) : (state.selectedLayerId && state.layers.find(l=>l.id===state.selectedLayerId)?.params?.warps?.[warpIdx]);
            if (!w || !w.points || !w.points[pointIdx]) return;
            w.activePointIndex = pointIdx;
            w.points[pointIdx].expanded = true;
            if (isGlobal) renderGlobal();
            else renderProps();
            requestRender();
        };

        function drawPointDeformerOverlays(cx, w, h) {
            let scaleFactor = w / 512;

            const drawWarpHandles = (warp, isGlobal) => {
                if (!warp || warp.visible === false || warp.showHandles === false) return;

                if (warp.type === 'point_deformer' && warp.points) {
                    warp.points.forEach((pt, pIdx) => {
                    let px = (pt.x !== undefined ? pt.x : 256) * scaleFactor;
                    let py = (pt.y !== undefined ? pt.y : 256) * scaleFactor;
                    let radius = (pt.radius || 100) * scaleFactor;
                    let isActive = (warp.activePointIndex === pIdx);

                    cx.save();

                    // 1. Outer influence circle
                    cx.beginPath();
                    cx.arc(px, py, radius, 0, Math.PI * 2);
                    cx.strokeStyle = isActive ? 'rgba(245, 158, 11, 0.85)' : (isGlobal ? 'rgba(16, 185, 129, 0.6)' : 'rgba(59, 130, 246, 0.6)');
                    cx.lineWidth = isActive ? 2.0 : 1.2;
                    cx.setLineDash([5, 4]);
                    cx.stroke();
                    cx.setLineDash([]);

                    if (isActive) {
                        cx.fillStyle = 'rgba(245, 158, 11, 0.06)';
                        cx.fill();
                    }

                    // 2. Vector arrow for push or spin arc for twist
                    if (pt.type === 'push') {
                        let rad = (pt.angle || 0) * Math.PI / 180;
                        let arrowLength = Math.min(radius * 0.75, 45 * scaleFactor);
                        let ax = px + Math.cos(rad) * arrowLength;
                        let ay = py + Math.sin(rad) * arrowLength;

                        cx.beginPath();
                        cx.moveTo(px, py);
                        cx.lineTo(ax, ay);
                        cx.strokeStyle = isActive ? '#f59e0b' : '#3b82f6';
                        cx.lineWidth = 2.0;
                        cx.stroke();

                        let headLen = 8 * scaleFactor;
                        cx.beginPath();
                        cx.moveTo(ax, ay);
                        cx.lineTo(ax - headLen * Math.cos(rad - Math.PI / 6), ay - headLen * Math.sin(rad - Math.PI / 6));
                        cx.lineTo(ax - headLen * Math.cos(rad + Math.PI / 6), ay - headLen * Math.sin(rad + Math.PI / 6));
                        cx.closePath();
                        cx.fillStyle = isActive ? '#f59e0b' : '#3b82f6';
                        cx.fill();
                    } else if (pt.type === 'twist') {
                        cx.beginPath();
                        let spinAngle = (pt.strength || 0.5) * Math.PI;
                        cx.arc(px, py, 14 * scaleFactor, 0, spinAngle, spinAngle < 0);
                        cx.strokeStyle = isActive ? '#f59e0b' : '#3b82f6';
                        cx.lineWidth = 1.5;
                        cx.stroke();
                    }

                    // 3. Center point handle
                    cx.beginPath();
                    cx.arc(px, py, isActive ? 8 : 6, 0, Math.PI * 2);
                    cx.fillStyle = isActive ? '#f59e0b' : (isGlobal ? '#10b981' : '#3b82f6');
                    cx.shadowColor = 'rgba(0,0,0,0.5)';
                    cx.shadowBlur = 4;
                    cx.fill();
                    cx.shadowBlur = 0;

                    cx.beginPath();
                    cx.arc(px, py, isActive ? 3 : 2.5, 0, Math.PI * 2);
                    cx.fillStyle = '#ffffff';
                    cx.fill();

                    // Label badge
                    cx.font = 'bold 10px sans-serif';
                    let label = `${isGlobal ? 'G' : 'L'}#${pIdx + 1} (${pt.type || 'inflate'})`;
                    let textWidth = cx.measureText(label).width;
                    
                    cx.fillStyle = 'rgba(15, 15, 17, 0.85)';
                    cx.fillRect(px - textWidth / 2 - 4, py - radius - 18, textWidth + 8, 14);
                    cx.strokeStyle = isActive ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255,255,255,0.2)';
                    cx.lineWidth = 1;
                    cx.strokeRect(px - textWidth / 2 - 4, py - radius - 18, textWidth + 8, 14);

                    cx.fillStyle = isActive ? '#f59e0b' : '#f4f4f5';
                    cx.textAlign = 'center';
                    cx.textBaseline = 'middle';
                    cx.fillText(label, px, py - radius - 11);

                    cx.restore();
                });
            } else if (warp.type === 'zoom_stretch') {
                let cxPos = (warp.centerX !== undefined ? warp.centerX : 0.5) * w;
                let cyPos = (warp.centerY !== undefined ? warp.centerY : 0.5) * h;
                let radius = (warp.radius !== undefined ? warp.radius : 250) * scaleFactor;
                let innerRadius = (warp.innerRadius || 0) * scaleFactor;

                cx.save();

                // 1. Outer influence circle
                cx.beginPath();
                cx.arc(cxPos, cyPos, radius, 0, Math.PI * 2);
                cx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
                cx.lineWidth = 1.8;
                cx.setLineDash([6, 4]);
                cx.stroke();
                cx.setLineDash([]);
                cx.fillStyle = 'rgba(245, 158, 11, 0.05)';
                cx.fill();

                // 2. Inner safe radius circle
                if (innerRadius > 0) {
                    cx.beginPath();
                    cx.arc(cxPos, cyPos, innerRadius, 0, Math.PI * 2);
                    cx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
                    cx.lineWidth = 1.5;
                    cx.setLineDash([3, 3]);
                    cx.stroke();
                    cx.setLineDash([]);
                }

                // 3. Radial direction indicators / crosshair
                let rayLen = Math.min(radius, 40 * scaleFactor);
                cx.strokeStyle = '#f59e0b';
                cx.lineWidth = 1.5;

                cx.beginPath();
                cx.moveTo(cxPos - rayLen, cyPos); cx.lineTo(cxPos + rayLen, cyPos);
                cx.moveTo(cxPos, cyPos - rayLen); cx.lineTo(cxPos, cyPos + rayLen);
                cx.stroke();

                // Radial arrowheads
                let st = warp.strength !== undefined ? warp.strength : 30;
                let arrowOffset = rayLen * 0.7;
                let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                let dirSign = st >= 0 ? 1 : -1;
                let headSize = 5 * scaleFactor;

                directions.forEach(([dxDir, dyDir]) => {
                    let ax = cxPos + dxDir * arrowOffset;
                    let ay = cyPos + dyDir * arrowOffset;
                    let dirX = dxDir * dirSign;
                    let dirY = dyDir * dirSign;

                    cx.beginPath();
                    cx.moveTo(ax + dirX * headSize, ay + dirY * headSize);
                    cx.lineTo(ax - dirY * headSize, ay + dirX * headSize);
                    cx.lineTo(ax + dirY * headSize, ay - dirX * headSize);
                    cx.closePath();
                    cx.fillStyle = '#f59e0b';
                    cx.fill();
                });

                // 4. Center point target handle
                cx.beginPath();
                cx.arc(cxPos, cyPos, 8, 0, Math.PI * 2);
                cx.fillStyle = '#f59e0b';
                cx.shadowColor = 'rgba(0,0,0,0.6)';
                cx.shadowBlur = 6;
                cx.fill();
                cx.shadowBlur = 0;

                cx.beginPath();
                cx.arc(cxPos, cyPos, 3, 0, Math.PI * 2);
                cx.fillStyle = '#ffffff';
                cx.fill();

                // 5. Label badge
                cx.font = 'bold 10px sans-serif';
                let label = `💫 Zoom Stretch (${st > 0 ? '+' : ''}${Math.round(st)}%)`;
                let textWidth = cx.measureText(label).width;

                cx.fillStyle = 'rgba(15, 15, 17, 0.88)';
                cx.fillRect(cxPos - textWidth / 2 - 5, cyPos - radius - 20, textWidth + 10, 16);
                cx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
                cx.lineWidth = 1;
                cx.strokeRect(cxPos - textWidth / 2 - 5, cyPos - radius - 20, textWidth + 10, 16);

                cx.fillStyle = '#f59e0b';
                cx.textAlign = 'center';
                cx.textBaseline = 'middle';
                cx.fillText(label, cxPos, cyPos - radius - 12);

                cx.restore();
            }
            };

            if (state.global && state.global.warps) {
                state.global.warps.forEach(w => drawWarpHandles(w, true));
            }

            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (lay && lay.visible && lay.params && lay.params.warps) {
                lay.params.warps.forEach(w => drawWarpHandles(w, false));
            }
        }

        function pointSliderRow(label, min, max, step, val, def, onInputExpr, isGlobal, warpIdx, pointIdx, propKey) {
            let prefix = isGlobal ? 'glob' : 'lay';
            let idKey = `${prefix}_pt_${propKey}_${warpIdx}_${pointIdx}`;
            return `<div style="margin-bottom:4px;">
                <label class="property-label" style="font-size:10px; margin-bottom:2px;">${label}</label>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="range" id="rng_${idKey}" min="${min}" max="${max}" step="${step}" value="${val}" oninput="$('num_${idKey}').value=this.value; ${onInputExpr}" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                    <input type="number" class="num-input" id="num_${idKey}" step="${step}" value="${val}" oninput="$('rng_${idKey}').value=this.value; ${onInputExpr}" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                    <button type="button" class="reset-btn" title="Скинути за замовчуванням (${def})" onclick="resetSliderEl(this.parentElement.querySelector('input[type=range]'),${def})">↺</button>
                </div>
            </div>`;
        }

        function renderWarpCardHTML(w, idx, isGlobal) {
            let updateFn = isGlobal ? 'updateGlobalWarp' : 'updateWarp';
            let toggleFn = isGlobal ? 'toggleGlobalWarp' : 'toggleWarp';
            let removeFn = isGlobal ? 'removeGlobalWarp' : 'removeWarp';
            let warpLabel = isGlobal ? `Глобальний №${idx+1}` : `Деформатор №${idx+1}`;
            let isExpanded = w.expanded !== false;

            const typeNames = {
                'none': 'Вимкнено',
                'point_deformer': '🎯 Точковий',
                'zoom_stretch': '💫 Zoom Stretch',
                'displacement': 'Displacement',
                'vortex': 'Vortex',
                'twirl': 'Twirl',
                'sine': 'Sine',
                'bulge': 'Pinch/Bulge',
                'noise': 'Perlin Noise',
                'domain_warp': 'Domain Warp',
                'distortion': 'Дісторсія',
                'polar': 'Полярні'
            };
            let typeBadge = typeNames[w.type] || w.type || 'Немає';
            let warpIcon = w.type === 'point_deformer' ? '🎯' : (w.type === 'zoom_stretch' ? '💫' : (w.type === 'none' ? '⚪' : '🌀'));

            if (w.type === 'point_deformer') {
                if (!w.points || !Array.isArray(w.points) || w.points.length === 0) {
                    w.points = [{ id: 'pt_1', x: 256, y: 256, type: 'inflate', falloff: 'smooth', radius: 100, strength: 0.5, angle: 0, expanded: true }];
                    w.activePointIndex = 0;
                }
                if (w.showHandles === undefined) w.showHandles = true;

                let typeLabels = {
                    inflate: 'Роздування',
                    deflate: 'Стискання',
                    twist: 'Скручування',
                    push: 'Зсув',
                    wave: 'Хвилі'
                };

                let pointsHTML = w.points.map((pt, pIdx) => {
                    let isActive = (w.activePointIndex === pIdx);
                    let isPtExpanded = pt.expanded !== false;
                    let typeName = typeLabels[pt.type] || pt.type || 'Inflate';

                    return `
                        <div class="deformer-point-card ${isActive ? 'active-point' : ''}" style="margin-bottom:8px; border:1px solid ${isActive ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)'}; border-radius:6px; background:${isActive ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)'}; padding:6px 8px;">
                            <div class="deformer-point-header" onclick="toggleDeformerPointExpanded(${isGlobal}, ${idx}, ${pIdx})" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none; padding:2px 0;">
                                <div style="display:flex; align-items:center; gap:6px;">
                                    <span style="font-size:10px; color:var(--text-muted);">${isPtExpanded ? '▾' : '▸'}</span>
                                    <span style="font-weight:700; font-size:11px; color:${isActive ? '#f59e0b' : '#3b82f6'};">📍 Точка #${pIdx+1}</span>
                                    <span style="font-size:10px; color:var(--text-muted); background:rgba(255,255,255,0.08); padding:1px 6px; border-radius:4px;">${typeName}</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:4px;">
                                    <button type="button" class="warp-del" onclick="event.stopPropagation(); removePointFromDeformer(${isGlobal}, ${idx}, ${pIdx})" title="Видалити точку" style="padding:1px 4px; font-size:11px;">✕</button>
                                </div>
                            </div>

                            <div class="deformer-point-body" style="display:${isPtExpanded ? 'block' : 'none'}; padding-top:8px; margin-top:6px; border-top:1px solid rgba(255,255,255,0.08);" onclick="event.stopPropagation()">
                                <div class="property-group" style="margin-bottom:6px;">
                                    <label class="property-label">Алгоритм деформації</label>
                                    <select onchange="updateDeformerPoint(${isGlobal}, ${idx}, ${pIdx}, 'type', this.value)" class="form-control" style="font-size:11px; height:28px;">
                                        <option value="inflate" ${pt.type==='inflate'?'selected':''}>Роздування (Inflate / Bulge)</option>
                                        <option value="deflate" ${pt.type==='deflate'?'selected':''}>Стискання (Deflate / Pinch)</option>
                                        <option value="twist" ${pt.type==='twist'?'selected':''}>Скручування (Twist / Spiral)</option>
                                        <option value="push" ${pt.type==='push'?'selected':''}>Зсув-витягування (Push Vector)</option>
                                        <option value="wave" ${pt.type==='wave'?'selected':''}>Хвилі / Рябь (Ripple Waves)</option>
                                    </select>
                                </div>
                                <div class="property-group" style="margin-bottom:6px;">
                                    <label class="property-label">Профіль загасання (Falloff)</label>
                                    <select onchange="updateDeformerPoint(${isGlobal}, ${idx}, ${pIdx}, 'falloff', this.value)" class="form-control" style="font-size:11px; height:28px;">
                                        <option value="smooth" ${pt.falloff==='smooth'?'selected':''}>Сферичний (Smoothstep)</option>
                                        <option value="linear" ${pt.falloff==='linear'?'selected':''}>Радіальний (Linear)</option>
                                        <option value="sharp" ${pt.falloff==='sharp'?'selected':''}>Різкий (Cubic Sharp)</option>
                                        <option value="ring" ${pt.falloff==='ring'?'selected':''}>Кільцевий (Sinusoidal Ring)</option>
                                    </select>
                                </div>
                                ${pointSliderRow("Координата X (px)", 0, 512, 1, pt.x !== undefined ? pt.x : 256, 256, `updateDeformerPoint(${isGlobal}, ${idx}, ${pIdx}, 'x', this.value)`, isGlobal, idx, pIdx, 'x')}
                                ${pointSliderRow("Координата Y (px)", 0, 512, 1, pt.y !== undefined ? pt.y : 256, 256, `updateDeformerPoint(${isGlobal}, ${idx}, ${pIdx}, 'y', this.value)`, isGlobal, idx, pIdx, 'y')}
                                ${pointSliderRow("Радіус зони (px)", 10, 400, 1, pt.radius || 100, 100, `updateDeformerPoint(${isGlobal}, ${idx}, ${pIdx}, 'radius', this.value)`, isGlobal, idx, pIdx, 'radius')}
                                ${pointSliderRow("Інтенсивність (Strength)", -2.0, 2.0, 0.05, pt.strength !== undefined ? pt.strength : 0.5, 0.5, `updateDeformerPoint(${isGlobal}, ${idx}, ${pIdx}, 'strength', this.value)`, isGlobal, idx, pIdx, 'strength')}
                                ${(pt.type === 'push' || pt.type === 'twist') ? pointSliderRow("Кут напрямку (°)", 0, 360, 1, pt.angle || 0, 0, `updateDeformerPoint(${isGlobal}, ${idx}, ${pIdx}, 'angle', this.value)`, isGlobal, idx, pIdx, 'angle') : ''}
                            </div>
                        </div>
                    `;
                }).join('');

                return `
                    <div class="warp-card accordion-block" data-warp-index="${idx}" style="${w.visible===false?'opacity:0.6;':''}">
                        <div class="accordion-header" onclick="toggleWarpExpanded(${isGlobal}, ${idx})" style="padding: 6px 10px;">
                            <div class="accordion-header-left">
                                <span class="accordion-chevron ${isExpanded ? 'open' : ''}">▼</span>
                                <span style="font-weight:700;">${warpIcon} ${warpLabel}</span>
                                <span class="badge" style="background:rgba(59,130,246,0.15); color:var(--primary-color); font-size:9px;">${typeBadge}</span>
                            </div>
                            <div class="warp-controls" onclick="event.stopPropagation()">
                                <button type="button" class="warp-toggle" onclick="${toggleFn}(${idx})" title="${w.visible!==false?'Приховати':'Показати'}">${w.visible!==false?'👁':'🕶'}</button>
                                <button type="button" class="warp-del" onclick="${removeFn}(${idx})" title="Видалити">✕</button>
                            </div>
                        </div>
                        
                        <div class="warp-card-body ${isExpanded ? '' : 'collapsed'}" style="padding: 10px; border-top: 1px solid var(--border-color); ${isExpanded ? '' : 'display:none;'}">
                            <label class="property-label" style="margin-top:2px;">Тип деформатора</label>
                            <select onchange="${updateFn}(${idx}, 'type', this.value)" class="form-control" style="margin-bottom:8px; margin-top:4px;">
                                <option value="none" ${w.type==='none'?'selected':''}>Немає</option>
                                <option value="point_deformer" selected>🎯 Точковий деформатор (Deformer Studio)</option>
                                <option value="zoom_stretch" ${w.type==='zoom_stretch'?'selected':''}>💫 Радіальне Витягування (Radial Zoom Stretch)</option>
                                <option value="displacement" ${w.type==='displacement'?'selected':''}>Displacement</option>
                                <option value="vortex" ${w.type==='vortex'?'selected':''}>Vortex</option>
                                <option value="twirl" ${w.type==='twirl'?'selected':''}>Twirl (Spiral Falloff)</option>
                                <option value="sine" ${w.type==='sine'?'selected':''}>Sine</option>
                                <option value="bulge" ${w.type==='bulge'?'selected':''}>Pinch/Bulge</option>
                                <option value="noise" ${w.type==='noise'?'selected':''}>Perlin Noise</option>
                                <option value="domain_warp" ${w.type==='domain_warp'?'selected':''}>Domain Warp</option>
                                <option value="distortion" ${w.type==='distortion'?'selected':''}>Дісторсія</option>
                                <option value="polar" ${w.type==='polar'?'selected':''}>Полярні координати</option>
                            </select>
                            
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; background:rgba(0,0,0,0.25); padding:4px 6px; border-radius:4px;">
                                <label class="checkbox-label" style="margin:0; font-size:11px;">
                                    <input type="checkbox" ${w.showHandles!==false?'checked':''} onchange="toggleDeformerHandles(${isGlobal}, ${idx}, this.checked)">
                                    🎯 Маркери на канвасі
                                </label>
                                <button type="button" class="btn btn-primary" style="padding:2px 6px; font-size:10px;" onclick="addPointToDeformer(${isGlobal}, ${idx})">+ Точка</button>
                            </div>

                            <div style="max-height:320px; overflow-y:auto; padding-right:2px;">
                                ${pointsHTML}
                            </div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="warp-card accordion-block" data-warp-index="${idx}" style="${w.visible===false?'opacity:0.6;':''}">
                    <div class="accordion-header" onclick="toggleWarpExpanded(${isGlobal}, ${idx})" style="padding: 6px 10px;">
                        <div class="accordion-header-left">
                            <span class="accordion-chevron ${isExpanded ? 'open' : ''}">▼</span>
                            <span style="font-weight:700;">${warpIcon} ${warpLabel}</span>
                            <span class="badge" style="background:rgba(59,130,246,0.15); color:var(--primary-color); font-size:9px;">${typeBadge}</span>
                        </div>
                        <div class="warp-controls" onclick="event.stopPropagation()">
                            <button type="button" class="warp-toggle" onclick="${toggleFn}(${idx})" title="${w.visible!==false?'Приховати':'Показати'}">${w.visible!==false?'👁':'🕶'}</button>
                            <button type="button" class="warp-del" onclick="${removeFn}(${idx})" title="Видалити">✕</button>
                        </div>
                    </div>

                    <div class="warp-card-body ${isExpanded ? '' : 'collapsed'}" style="padding: 10px; border-top: 1px solid var(--border-color); ${isExpanded ? '' : 'display:none;'}">
                        <label class="property-label" style="margin-top:2px;">Тип деформатора</label>
                        <select onchange="${updateFn}(${idx}, 'type', this.value)" class="form-control" style="margin-bottom:8px; margin-top:4px;">
                            <option value="none" ${w.type==='none'?'selected':''}>Немає</option>
                            <option value="point_deformer" ${w.type==='point_deformer'?'selected':''}>🎯 Точковий деформатор (Deformer Studio)</option>
                            <option value="zoom_stretch" ${w.type==='zoom_stretch'?'selected':''}>💫 Радіальне Витягування (Radial Zoom Stretch)</option>
                            <option value="displacement" ${w.type==='displacement'?'selected':''}>Displacement</option>
                            <option value="vortex" ${w.type==='vortex'?'selected':''}>Vortex</option>
                            <option value="twirl" ${w.type==='twirl'?'selected':''}>Twirl (Spiral Falloff)</option>
                            <option value="sine" ${w.type==='sine'?'selected':''}>Sine</option>
                            <option value="bulge" ${w.type==='bulge'?'selected':''}>Pinch/Bulge</option>
                            <option value="noise" ${w.type==='noise'?'selected':''}>Perlin Noise</option>
                            <option value="domain_warp" ${w.type==='domain_warp'?'selected':''}>Domain Warp</option>
                            <option value="distortion" ${w.type==='distortion'?'selected':''}>Дісторсія</option>
                            <option value="polar" ${w.type==='polar'?'selected':''}>Полярні координати</option>
                        </select>
                        ${w.type === 'zoom_stretch' ? `
                        <div style="background:rgba(255,255,255,0.02); padding:8px; border-radius:6px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.08);">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:rgba(0,0,0,0.2); padding:4px 6px; border-radius:4px;">
                                <span style="font-weight:700; font-size:10px; color:#f59e0b;">🎯 Центр та Параметри Zoom Stretch</span>
                                <label class="checkbox-label" style="margin:0; font-size:10px;">
                                    <input type="checkbox" ${w.showHandles!==false?'checked':''} onchange="toggleDeformerHandles(${isGlobal}, ${idx}, this.checked)">
                                    Маркер на канвасі
                                </label>
                            </div>
                            
                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Центр X (Position X px)</label>
                                ${sliderRow(0, 512, 1, Math.round((w.centerX !== undefined ? w.centerX : 0.5) * 512), 256, `${updateFn}(${idx}, 'centerX', this.value / 512)`)}
                            </div>

                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Центр Y (Position Y px)</label>
                                ${sliderRow(0, 512, 1, Math.round((w.centerY !== undefined ? w.centerY : 0.5) * 512), 256, `${updateFn}(${idx}, 'centerY', this.value / 512)`)}
                            </div>

                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Сила Zoom Stretch (% intensity)</label>
                                ${sliderRow(-300, 300, 1, w.strength !== undefined ? w.strength : 50, 50, `${updateFn}(${idx}, 'strength', this.value)`)}
                            </div>

                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Радіус впливу (Radius px)</label>
                                ${sliderRow(10, 1000, 1, w.radius !== undefined ? w.radius : 500, 500, `${updateFn}(${idx}, 'radius', this.value)`)}
                            </div>

                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Профіль загасання (Falloff Profile)</label>
                                <select class="form-control" onchange="${updateFn}(${idx}, 'falloff', this.value)" style="font-size:11px;">
                                    <option value="zoom_rays" ${(w.falloff || 'zoom_rays') === 'zoom_rays' || w.falloff === 'linear' ? 'selected' : ''}>💫 Photoshop Zoom Blur (Витягування від центру до країв)</option>
                                    <option value="full" ${w.falloff === 'full' || w.falloff === 'constant' ? 'selected' : ''}>🌐 Повний Zoom (Рівномірний масштаб по всьому полотну)</option>
                                    <option value="smooth" ${w.falloff === 'smooth' ? 'selected' : ''}>🌊 Плавний купол (Smoothstep)</option>
                                    <option value="exponential" ${w.falloff === 'exponential' ? 'selected' : ''}>📈 Прискорений до країв (Exponential Rays)</option>
                                    <option value="spherical" ${w.falloff === 'spherical' ? 'selected' : ''}>🔮 Сферичний лінзовий Zoom (Spherical)</option>
                                </select>
                            </div>

                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Ступінь / Експонента (Power Curve)</label>
                                ${sliderRow(0.1, 5.0, 0.1, w.power !== undefined ? w.power : 1.0, 1.0, `${updateFn}(${idx}, 'power', this.value)`)}
                            </div>

                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Скручування / Спіраль (Spiral Twist °)</label>
                                ${sliderRow(-360, 360, 1, w.twist !== undefined ? w.twist : 0, 0, `${updateFn}(${idx}, 'twist', this.value)`)}
                            </div>

                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Захисна внутрішня зона (Inner Safe Radius px)</label>
                                ${sliderRow(0, 250, 1, w.innerRadius !== undefined ? w.innerRadius : 0, 0, `${updateFn}(${idx}, 'innerRadius', this.value)`)}
                            </div>

                            <div style="margin-bottom:6px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:2px;">Режим обробки меж (Edge Mode)</label>
                                <select class="form-control" onchange="${updateFn}(${idx}, 'tileWrap', this.value)" style="font-size:11px;">
                                    <option value="none" ${(w.tileWrap || 'none') === 'none' ? 'selected' : ''}>✨ Безперервне просторове (Continuous / Без швів та сегментів)</option>
                                    <option value="wrap" ${w.tileWrap === 'wrap' ? 'selected' : ''}>🔄 Повторення плитки 1x1 (Tile Wrap)</option>
                                    <option value="clamp" ${w.tileWrap === 'clamp' ? 'selected' : ''}>✂️ Обрізка за краями (Clamp)</option>
                                    <option value="mirror" ${w.tileWrap === 'mirror' ? 'selected' : ''}>🪞 Дзеркальне (Mirror)</option>
                                </select>
                            </div>
                        </div>
                        ` : ''}
                        ${w.type === 'displacement' ? `
                        <div style="margin-bottom:6px;">
                            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Режим Displacement</label>
                            <select class="form-control" onchange="${updateFn}(${idx}, 'dispMode', this.value)" style="margin-bottom:6px; font-size:11px;">
                                <option value="height_gradient" ${(w.dispMode || 'height_gradient') === 'height_gradient' ? 'selected' : ''}>🏔️ Градієнт висоти (Slope / Поверхня)</option>
                                <option value="vector_field" ${w.dispMode === 'vector_field' ? 'selected' : ''}>🌀 Векторний шум (X/Y Offset)</option>
                                <option value="directional" ${w.dispMode === 'directional' ? 'selected' : ''}>➡️ Напрямковий (по куту)</option>
                                <option value="radial" ${w.dispMode === 'radial' ? 'selected' : ''}>⭕ Радіальний</option>
                            </select>
                        </div>
                        ${(w.dispMode === 'directional') ? `
                        <div style="margin-bottom:4px;">
                            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Кут напрямку (°)</label>
                            ${sliderRow(0, 360, 1, w.angle !== undefined ? w.angle : 0, 0, `${updateFn}(${idx}, 'angle', this.value)`)}
                        </div>` : ''}
                        ` : ''}
                        ${(w.type !== 'none' && w.type !== 'zoom_stretch') ? `
                        <div style="margin-bottom:4px;">
                            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Сила (Strength)</label>
                            ${sliderRow(-100, 100, 1, w.strength !== undefined ? w.strength : 10, 10, `${updateFn}(${idx}, 'strength', this.value)`)}
                        </div>
                        <div style="margin-bottom:4px;">
                            <label class="property-label" style="font-size:10px; margin-bottom:2px;">Частота / Масштаб (Frequency)</label>
                            ${sliderRow(0.1, 20, 0.1, w.freq !== undefined ? w.freq : 4, 4, `${updateFn}(${idx}, 'freq', this.value)`)}
                        </div>` : ''}
                    </div>
                </div>
            `;
        }

        let state = {
            layers: [{
                id: 'l1', name: 'Procedural Web', visible: true, opacity: 100, blendMode: 'normal', generatorType: 'spider_web', isMask: false,
                params: { 
                    seamless: false, scale: 10, scaleX: 10, scaleY: 10, layerScale: 1, contrast: 1, invert: false, blur: 0, 
                    offsetX: 0, offsetY: 0, angle: 0, 
                    warps: [],
                    useThreshold: false, thresholdVal: 50,
                    useLevels: false, levelMin: 0, levelMax: 100,
                    usePosterize: false, posterizeLevels: 4,
                    useFindEdges: false,
                    radialCount: 18, ringCount: 22, ringThick: 0.04, radThick: 0.025,
                    enableRays: true, enableRings: true,
                    wobble: 0.03, jitter: 8, ringSineAmp: 0, ringSineFreq: 5,
                    radSineAmp: 0, radSineFreq: 10, fractal: 0
                }
            }],
            selectedLayerId: 'l1',
            global: freshGlobalSettings()
        };

        // Color blending helpers for HSL modes (Hue, Saturation, Color, Luminosity)
        function blendGetLum(r, g, b) {
            return 0.299 * r + 0.587 * g + 0.114 * b;
        }

        function blendClipColor(r, g, b) {
            let l = blendGetLum(r, g, b);
            let n = Math.min(r, g, b);
            let x = Math.max(r, g, b);
            if (n < 0) {
                let inv = 1 / (l - n + 1e-6);
                r = l + ((r - l) * l) * inv;
                g = l + ((g - l) * l) * inv;
                b = l + ((b - l) * l) * inv;
            }
            if (x > 1) {
                let inv = 1 / (x - l + 1e-6);
                r = l + ((r - l) * (1 - l)) * inv;
                g = l + ((g - l) * (1 - l)) * inv;
                b = l + ((b - l) * (1 - l)) * inv;
            }
            return [
                Math.max(0, Math.min(1, r)),
                Math.max(0, Math.min(1, g)),
                Math.max(0, Math.min(1, b))
            ];
        }

        function blendSetLum(r, g, b, l) {
            let d = l - blendGetLum(r, g, b);
            return blendClipColor(r + d, g + d, b + d);
        }

        function blendGetSat(r, g, b) {
            return Math.max(r, g, b) - Math.min(r, g, b);
        }

        function blendSetSat(r, g, b, s) {
            let rgb = [r, g, b];
            let minI = 0, midI = 1, maxI = 2;
            if (rgb[0] > rgb[1]) { minI = 1; midI = 0; }
            if (rgb[midI] > rgb[2]) {
                midI = 2;
                if (rgb[minI] > rgb[midI]) { minI = 2; midI = 0; }
            }
            if (rgb[0] >= rgb[1] && rgb[0] >= rgb[2]) maxI = 0;
            else if (rgb[1] >= rgb[0] && rgb[1] >= rgb[2]) maxI = 1;
            else maxI = 2;

            if (rgb[0] <= rgb[1] && rgb[0] <= rgb[2]) minI = 0;
            else if (rgb[1] <= rgb[0] && rgb[1] <= rgb[2]) minI = 1;
            else minI = 2;

            midI = 3 - minI - maxI;

            let res = [0, 0, 0];
            if (rgb[maxI] > rgb[minI]) {
                res[midI] = ((rgb[midI] - rgb[minI]) * s) / (rgb[maxI] - rgb[minI]);
                res[maxI] = s;
            } else {
                res[midI] = 0;
                res[maxI] = 0;
            }
            res[minI] = 0;
            return res;
        }

        function makeColorBlendFn(fn) {
            fn.isColorMode = true;
            return fn;
        }

        const BLEND_MODE_GROUPS = [
            {
                label: 'Звичайний (Normal)',
                modes: [
                    { id: 'normal', name: 'Normal (Звичайний)' }
                ]
            },
            {
                label: 'Затемнення (Darken)',
                modes: [
                    { id: 'darken', name: 'Darken (Затемнення)' },
                    { id: 'multiply', name: 'Multiply (Множення)' },
                    { id: 'colorburn', name: 'Color Burn (Затемнення кольору)' },
                    { id: 'linearburn', name: 'Linear Burn (Лінійне затемнення)' },
                    { id: 'darkercolor', name: 'Darker Color (Темніший колір)' }
                ]
            },
            {
                label: 'Освітлення (Lighten)',
                modes: [
                    { id: 'lighten', name: 'Lighten (Освітлення)' },
                    { id: 'screen', name: 'Screen (Екран)' },
                    { id: 'colordodge', name: 'Color Dodge (Освітлення кольору)' },
                    { id: 'lineardodge', name: 'Linear Dodge / Add (Лінійне освітлення)' },
                    { id: 'lightercolor', name: 'Lighter Color (Світліший колір)' }
                ]
            },
            {
                label: 'Контраст (Contrast)',
                modes: [
                    { id: 'overlay', name: 'Overlay (Перекриття)' },
                    { id: 'softlight', name: 'Soft Light (М\'яке світло)' },
                    { id: 'hardlight', name: 'Hard Light (Жорстке світло)' },
                    { id: 'vividlight', name: 'Vivid Light (Яскраве світло)' },
                    { id: 'linearlight', name: 'Linear Light (Лінійне світло)' },
                    { id: 'pinlight', name: 'Pin Light (Точкове світло)' },
                    { id: 'hardmix', name: 'Hard Mix (Жорстке змішування)' }
                ]
            },
            {
                label: 'Різниця та інверсія (Comparative)',
                modes: [
                    { id: 'difference', name: 'Difference (Різниця)' },
                    { id: 'exclusion', name: 'Exclusion (Виключення)' },
                    { id: 'subtract', name: 'Subtract (Віднімання)' },
                    { id: 'divide', name: 'Divide (Ділення)' },
                    { id: 'average', name: 'Average (Середнє)' },
                    { id: 'negation', name: 'Negation (Негатив)' }
                ]
            },
            {
                label: 'Колір HSL (Color / HSL)',
                modes: [
                    { id: 'hue', name: 'Hue (Тон)' },
                    { id: 'saturation', name: 'Saturation (Насиченість)' },
                    { id: 'color', name: 'Color (Колір)' },
                    { id: 'luminosity', name: 'Luminosity (Світлота)' }
                ]
            },
            {
                label: 'Спеціальні (Special)',
                modes: [
                    { id: 'heightblend', name: 'Height Blend (Повисотна суміш)' }
                ]
            }
        ];

        const Blend = {
            normal: (b, t) => t,
            multiply: (b, t) => b * t,
            darken: (b, t) => Math.min(b, t),
            colorburn: (b, t) => t <= 0 ? 0 : Math.max(0, 1 - (1 - b) / t),
            linearburn: (b, t) => Math.max(0, b + t - 1),
            darkercolor: makeColorBlendFn((bR, bG, bB, tR, tG, tB) => 
                (0.299*bR + 0.587*bG + 0.114*bB < 0.299*tR + 0.587*tG + 0.114*tB) ? [bR, bG, bB] : [tR, tG, tB]
            ),

            screen: (b, t) => 1 - (1 - b) * (1 - t),
            lighten: (b, t) => Math.max(b, t),
            colordodge: (b, t) => t >= 1 ? 1 : Math.min(1, b / (1 - t)),
            lineardodge: (b, t) => Math.min(1, b + t),
            lightercolor: makeColorBlendFn((bR, bG, bB, tR, tG, tB) => 
                (0.299*bR + 0.587*bG + 0.114*bB > 0.299*tR + 0.587*tG + 0.114*tB) ? [bR, bG, bB] : [tR, tG, tB]
            ),

            overlay: (b, t) => b < 0.5 ? 2 * b * t : 1 - 2 * (1 - b) * (1 - t),
            softlight: (b, t) => t <= 0.5 ? b - (1 - 2 * t) * b * (1 - b) : (b <= 0.25 ? b + (2 * t - 1) * (((16 * b - 12) * b + 4) * b - b) : b + (2 * t - 1) * (Math.sqrt(b) - b)),
            hardlight: (b, t) => t < 0.5 ? 2 * b * t : 1 - 2 * (1 - b) * (1 - t),
            vividlight: (b, t) => t <= 0.5 ? (t <= 0 ? 0 : Math.max(0, 1 - (1 - b) / (2 * t))) : (t >= 1 ? 1 : Math.min(1, b / (2 * (1 - t)))),
            linearlight: (b, t) => Math.max(0, Math.min(1, b + 2 * t - 1)),
            pinlight: (b, t) => t < 0.5 ? Math.min(b, 2 * t) : Math.max(b, 2 * (t - 0.5)),
            hardmix: (b, t) => ((t <= 0.5 ? (t <= 0 ? 0 : Math.max(0, 1 - (1 - b) / (2 * t))) : (t >= 1 ? 1 : Math.min(1, b / (2 * (1 - t))))) >= 0.5 ? 1 : 0),

            difference: (b, t) => Math.abs(b - t),
            exclusion: (b, t) => b + t - 2 * b * t,
            subtract: (b, t) => Math.max(0, b - t),
            divide: (b, t) => t <= 0 ? 1 : Math.min(1, b / t),
            average: (b, t) => (b + t) * 0.5,
            negation: (b, t) => 1 - Math.abs(1 - b - t),

            hue: makeColorBlendFn((bR, bG, bB, tR, tG, tB) => {
                let satB = blendGetSat(bR, bG, bB);
                let lumB = blendGetLum(bR, bG, bB);
                let satT = blendSetSat(tR, tG, tB, satB);
                return blendSetLum(satT[0], satT[1], satT[2], lumB);
            }),
            saturation: makeColorBlendFn((bR, bG, bB, tR, tG, tB) => {
                let satT = blendGetSat(tR, tG, tB);
                let lumB = blendGetLum(bR, bG, bB);
                let satB = blendSetSat(bR, bG, bB, satT);
                return blendSetLum(satB[0], satB[1], satB[2], lumB);
            }),
            color: makeColorBlendFn((bR, bG, bB, tR, tG, tB) => {
                let lumB = blendGetLum(bR, bG, bB);
                return blendSetLum(tR, tG, tB, lumB);
            }),
            luminosity: makeColorBlendFn((bR, bG, bB, tR, tG, tB) => {
                let lumT = blendGetLum(tR, tG, tB);
                return blendSetLum(bR, bG, bB, lumT);
            }),

            heightblend: (b, t) => Math.max(b, t)
        };

        function applyBoxBlur(buf, tmp, w, h, rad, mode = 'wrap') {
            let scaledRad = Math.max(0, Math.round(rad * (w / 512)));
            if (scaledRad <= 0) return;
            let r = scaledRad;
            let effectiveMode = mode;
            if (typeof mode === 'boolean') {
                effectiveMode = mode ? 'clamp' : 'wrap';
            }

            let invWindow = 1 / (2 * r + 1);

            // Horizontal Pass O(1) Moving Sum
            for (let y = 0; y < h; y++) {
                let rowOffset = y * w;
                let sum = 0;
                for (let dx = -r; dx <= r; dx++) {
                    let nx = dx;
                    if (effectiveMode === 'clamp') nx = nx < 0 ? 0 : (nx >= w ? w - 1 : nx);
                    else if (effectiveMode === 'wrap') nx = (nx % w + w) % w;
                    else nx = nx < 0 ? 0 : (nx >= w ? w - 1 : nx);
                    sum += buf[rowOffset + nx];
                }
                tmp[rowOffset] = sum * invWindow;

                for (let x = 1; x < w; x++) {
                    let leftX = x - r - 1;
                    let rightX = x + r;
                    if (effectiveMode === 'clamp') {
                        leftX = leftX < 0 ? 0 : leftX;
                        rightX = rightX >= w ? w - 1 : rightX;
                    } else if (effectiveMode === 'wrap') {
                        leftX = (leftX % w + w) % w;
                        rightX = (rightX % w + w) % w;
                    } else {
                        leftX = leftX < 0 ? 0 : leftX;
                        rightX = rightX >= w ? w - 1 : rightX;
                    }
                    sum += buf[rowOffset + rightX] - buf[rowOffset + leftX];
                    tmp[rowOffset + x] = sum * invWindow;
                }
            }

            // Vertical Pass O(1) Moving Sum
            for (let x = 0; x < w; x++) {
                let sum = 0;
                for (let dy = -r; dy <= r; dy++) {
                    let ny = dy;
                    if (effectiveMode === 'clamp') ny = ny < 0 ? 0 : (ny >= h ? h - 1 : ny);
                    else if (effectiveMode === 'wrap') ny = (ny % h + h) % h;
                    else ny = ny < 0 ? 0 : (ny >= h ? h - 1 : ny);
                    sum += tmp[ny * w + x];
                }
                buf[x] = sum * invWindow;

                for (let y = 1; y < h; y++) {
                    let topY = y - r - 1;
                    let bottomY = y + r;
                    if (effectiveMode === 'clamp') {
                        topY = topY < 0 ? 0 : topY;
                        bottomY = bottomY >= h ? h - 1 : bottomY;
                    } else if (effectiveMode === 'wrap') {
                        topY = (topY % h + h) % h;
                        bottomY = (bottomY % h + h) % h;
                    } else {
                        topY = topY < 0 ? 0 : topY;
                        bottomY = bottomY >= h ? h - 1 : bottomY;
                    }
                    sum += tmp[bottomY * w + x] - tmp[topY * w + x];
                    buf[y * w + x] = sum * invWindow;
                }
            }
        }

        const gaussianKernelCache = new Map();
        function getGaussianWeights(kSize) {
            if (gaussianKernelCache.has(kSize)) {
                return gaussianKernelCache.get(kSize);
            }
            let sigma = Math.max(kSize / 2, 0.5);
            let weights = new Float32Array(2 * kSize + 1);
            let weightSum = 0;
            for (let i = -kSize; i <= kSize; i++) {
                let wVal = Math.exp(-(i * i) / (2 * sigma * sigma));
                weights[i + kSize] = wVal;
                weightSum += wVal;
            }
            for (let i = 0; i < weights.length; i++) {
                weights[i] /= weightSum;
            }
            gaussianKernelCache.set(kSize, weights);
            return weights;
        }

        function applyGaussianBlur(buf, tmp, w, h, rad, mode = 'wrap') {
            if (!rad || rad <= 0) return;
            let scaledRad = Math.max(1, Math.round(rad * (w / 512)));

            let effectiveMode = mode;
            if (typeof mode === 'boolean') {
                effectiveMode = mode ? 'clamp' : 'wrap';
            }

            let kSize = scaledRad;
            let weights = getGaussianWeights(kSize);

            // Horizontal pass
            for (let y = 0; y < h; y++) {
                let rowOffset = y * w;
                for (let x = 0; x < w; x++) {
                    let sum = 0;
                    for (let dx = -kSize; dx <= kSize; dx++) {
                        let nx = x + dx;
                        let wVal = weights[dx + kSize];
                        if (effectiveMode === 'clamp') {
                            if (nx < 0) nx = 0;
                            else if (nx >= w) nx = w - 1;
                            sum += buf[rowOffset + nx] * wVal;
                        } else if (effectiveMode === 'wrap') {
                            nx = (nx % w + w) % w;
                            sum += buf[rowOffset + nx] * wVal;
                        } else {
                            if (nx >= 0 && nx < w) {
                                sum += buf[rowOffset + nx] * wVal;
                            }
                        }
                    }
                    tmp[rowOffset + x] = sum;
                }
            }

            // Vertical pass
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let sum = 0;
                    for (let dy = -kSize; dy <= kSize; dy++) {
                        let ny = y + dy;
                        let wVal = weights[dy + kSize];
                        if (effectiveMode === 'clamp') {
                            if (ny < 0) ny = 0;
                            else if (ny >= h) ny = h - 1;
                            sum += tmp[ny * w + x] * wVal;
                        } else if (effectiveMode === 'wrap') {
                            ny = (ny % h + h) % h;
                            sum += tmp[ny * w + x] * wVal;
                        } else {
                            if (ny >= 0 && ny < h) {
                                sum += tmp[ny * w + x] * wVal;
                            }
                        }
                    }
                    buf[y * w + x] = sum;
                }
            }
        }

        function applyEdgeDetection(buf, tmp, w, h) {
            let step = Math.max(1, Math.round(w / 512));
            for(let i=0;i<w*h;i++) tmp[i]=buf[i];
            for(let y=step;y<h-step;y++) for(let x=step;x<w-step;x++){
                let i=y*w+x, val = tmp[i]*4 - tmp[i-step] - tmp[i+step] - tmp[i-w*step] - tmp[i+w*step];
                buf[i] = Math.max(0, Math.min(1, Math.abs(val)));
            }
        }

        function getGlobalFloatBuffer(name, size) {
            if (!window._globalFloatBuffers) window._globalFloatBuffers = {};
            if (!window._globalFloatBuffers[name] || window._globalFloatBuffers[name].length !== size) {
                window._globalFloatBuffers[name] = new Float32Array(size);
            }
            return window._globalFloatBuffers[name];
        }


        const PALETTE_PRESETS = {
            custom: null,
            wood_oak: [
                { pos: 0.0, color: '#2a1608' },
                { pos: 0.35, color: '#593213' },
                { pos: 0.7, color: '#a06535' },
                { pos: 1.0, color: '#d1a16e' }
            ],
            wood_mahogany: [
                { pos: 0.0, color: '#1a0505' },
                { pos: 0.4, color: '#4d1212' },
                { pos: 0.75, color: '#802626' },
                { pos: 1.0, color: '#b34d3b' }
            ],
            marble_carrara: [
                { pos: 0.0, color: '#2b2d30' },
                { pos: 0.25, color: '#5b6168' },
                { pos: 0.5, color: '#a8b0b8' },
                { pos: 0.8, color: '#e6ebf0' },
                { pos: 1.0, color: '#fcfdff' }
            ],
            stone_slate: [
                { pos: 0.0, color: '#111317' },
                { pos: 0.35, color: '#272b33' },
                { pos: 0.7, color: '#4a505e' },
                { pos: 1.0, color: '#7a8396' }
            ],
            moss_forest: [
                { pos: 0.0, color: '#0b1c09' },
                { pos: 0.3, color: '#234a15' },
                { pos: 0.65, color: '#4e8524' },
                { pos: 1.0, color: '#8cc63f' }
            ],
            lava_fire: [
                { pos: 0.0, color: '#0a0000' },
                { pos: 0.25, color: '#520300' },
                { pos: 0.55, color: '#cc2200' },
                { pos: 0.8, color: '#ff8800' },
                { pos: 1.0, color: '#ffffaa' }
            ],
            gold_polished: [
                { pos: 0.0, color: '#261800' },
                { pos: 0.3, color: '#6e4c00' },
                { pos: 0.6, color: '#cca014' },
                { pos: 0.85, color: '#ffd700' },
                { pos: 1.0, color: '#fff5b8' }
            ],
            cyberpunk: [
                { pos: 0.0, color: '#08001a' },
                { pos: 0.3, color: '#500078' },
                { pos: 0.65, color: '#f000ff' },
                { pos: 0.85, color: '#00f0ff' },
                { pos: 1.0, color: '#ffffff' }
            ],
            ocean_deep: [
                { pos: 0.0, color: '#020b14' },
                { pos: 0.35, color: '#093154' },
                { pos: 0.7, color: '#16699a' },
                { pos: 1.0, color: '#4fc3f7' }
            ],
            leather_brown: [
                { pos: 0.0, color: '#170c06' },
                { pos: 0.35, color: '#3b1f10' },
                { pos: 0.7, color: '#703e23' },
                { pos: 1.0, color: '#a86d48' }
            ],
            rust_iron: [
                { pos: 0.0, color: '#121214' },
                { pos: 0.3, color: '#3a2016' },
                { pos: 0.65, color: '#873c1d' },
                { pos: 0.85, color: '#cc5825' },
                { pos: 1.0, color: '#f09050' }
            ],
            sand_dune: [
                { pos: 0.0, color: '#292218' },
                { pos: 0.35, color: '#69563e' },
                { pos: 0.7, color: '#b59a72' },
                { pos: 1.0, color: '#ebd2b0' }
            ],
            ice_glacier: [
                { pos: 0.0, color: '#0a1520' },
                { pos: 0.35, color: '#214d6e' },
                { pos: 0.7, color: '#5da0c7' },
                { pos: 1.0, color: '#d9f2ff' }
            ]
        };

        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 };
        }

        function hexToRgbNormalized(hex) {
            if (!hex) return [1, 1, 1];
            const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return res ? [parseInt(res[1], 16) / 255, parseInt(res[2], 16) / 255, parseInt(res[3], 16) / 255] : [1, 1, 1];
        }

        function sampleColorRampNormalized(v, stops) {
            if (!stops || stops.length === 0) return [v, v, v];
            if (v <= stops[0].pos) return hexToRgbNormalized(stops[0].color);
            if (v >= stops[stops.length - 1].pos) return hexToRgbNormalized(stops[stops.length - 1].color);
            for (let i = 0; i < stops.length - 1; i++) {
                let s0 = stops[i], s1 = stops[i + 1];
                if (v >= s0.pos && v <= s1.pos) {
                    let span = s1.pos - s0.pos;
                    let t = span > 0 ? (v - s0.pos) / span : 0;
                    let c0 = hexToRgbNormalized(s0.color);
                    let c1 = hexToRgbNormalized(s1.color);
                    return [
                        c0[0] + (c1[0] - c0[0]) * t,
                        c0[1] + (c1[1] - c0[1]) * t,
                        c0[2] + (c1[2] - c0[2]) * t
                    ];
                }
            }
            return [v, v, v];
        }

        function applyRgbColorAdjustments(rgb, hueShift, sat, vib) {
            let r = rgb[0], g = rgb[1], b = rgb[2];

            if (hueShift !== 0) {
                let angle = hueShift * Math.PI / 180;
                let cosA = Math.cos(angle);
                let sinA = Math.sin(angle);

                let nr = r * (0.213 + cosA * 0.787 - sinA * 0.213) + g * (0.715 - cosA * 0.715 - sinA * 0.715) + b * (0.072 - cosA * 0.072 + sinA * 0.928);
                let ng = r * (0.213 - cosA * 0.213 + sinA * 0.143) + g * (0.715 + cosA * 0.285 + sinA * 0.140) + b * (0.072 - cosA * 0.072 - sinA * 0.283);
                let nb = r * (0.213 - cosA * 0.213 - sinA * 0.787) + g * (0.715 - cosA * 0.715 + sinA * 0.715) + b * (0.072 + cosA * 0.928 + sinA * 0.072);
                r = nr; g = ng; b = nb;
            }

            if (sat !== 100) {
                let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                let factor = sat / 100;
                r = lum + (r - lum) * factor;
                g = lum + (g - lum) * factor;
                b = lum + (b - lum) * factor;
            }

            if (vib > 0) {
                let maxC = Math.max(r, Math.max(g, b));
                let minC = Math.min(r, Math.min(g, b));
                let satCurrent = maxC - minC;
                let factor = (1 - satCurrent) * (vib / 100) * 0.5;
                let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                r = r + (r - lum) * factor;
                g = g + (g - lum) * factor;
                b = b + (b - lum) * factor;
            }

            return [
                Math.max(0, Math.min(1, r)),
                Math.max(0, Math.min(1, g)),
                Math.max(0, Math.min(1, b))
            ];
        }

        function buildLayerColorLUT(p, generatorType) {
            const lutR = new Float32Array(256);
            const lutG = new Float32Array(256);
            const lutB = new Float32Array(256);

            let mode = p.colorMode || 'grayscale';
            let isGradient = (generatorType === 'gradient' || p.gradType !== undefined || (p.stops && p.stops.length > 0));

            // Automatically use color_ramp mode for gradient generator layers or layers with stops
            if (isGradient && mode === 'grayscale') {
                mode = 'color_ramp';
            }

            const hueShift = p.hueShift || 0;
            const sat = p.saturation !== undefined ? p.saturation : 100;
            const vib = p.vibrance || 0;
            const colInvert = !!p.colorInvert;

            let sortedStops = null;
            if (mode === 'color_ramp') {
                if (p.palettePreset && p.palettePreset !== 'custom' && PALETTE_PRESETS[p.palettePreset]) {
                    sortedStops = PALETTE_PRESETS[p.palettePreset];
                } else if (p.stops && p.stops.length > 0) {
                    sortedStops = p.stops.slice().sort((a, b) => a.pos - b.pos);
                } else if (p.colorStops && p.colorStops.length > 0) {
                    sortedStops = p.colorStops.slice().sort((a, b) => a.pos - b.pos);
                }
            }

            const cA = hexToRgbNormalized(p.colorA || '#ffffff');
            const cB = hexToRgbNormalized(p.colorB || '#000000');

            for (let i = 0; i < 256; i++) {
                let v = i / 255;
                if (colInvert) v = 1 - v;

                let r = v, g = v, b = v;

                if (mode === 'tint') {
                    r = cB[0] + (cA[0] - cB[0]) * v;
                    g = cB[1] + (cA[1] - cB[1]) * v;
                    b = cB[2] + (cA[2] - cB[2]) * v;
                } else if (mode === 'color_ramp' && sortedStops && sortedStops.length > 0) {
                    const rgb = sampleColorRampNormalized(v, sortedStops);
                    r = rgb[0]; g = rgb[1]; b = rgb[2];
                }

                if (hueShift !== 0 || sat !== 100 || vib !== 0) {
                    const adj = applyRgbColorAdjustments([r, g, b], hueShift, sat, vib);
                    r = adj[0]; g = adj[1]; b = adj[2];
                }

                lutR[i] = Math.max(0, Math.min(1, r));
                lutG[i] = Math.max(0, Math.min(1, g));
                lutB[i] = Math.max(0, Math.min(1, b));
            }

            return { lutR, lutG, lutB };
        }

        function ensureLayerPaintCanvas(lay, forceReloadFromDataUrl = false) {
            if (!lay.paintCanvas || typeof lay.paintCanvas.getContext !== 'function') {
                lay.paintCanvas = document.createElement('canvas');
                lay.paintCanvas.width = 1024;
                lay.paintCanvas.height = 1024;
                let ctx = lay.paintCanvas.getContext('2d');
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, 1024, 1024);
                
                if (lay.params && lay.params.paintDataUrl) {
                    let img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, 1024, 1024);
                        ctx.drawImage(img, 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                        invalidateCaches();
                        requestRender();
                    };
                    img.src = lay.params.paintDataUrl;
                    if (img.complete && img.naturalWidth) {
                        ctx.clearRect(0, 0, 1024, 1024);
                        ctx.drawImage(img, 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                        invalidateCaches();
                    }
                } else {
                    updatePaintBuffer(lay);
                }
            } else if (forceReloadFromDataUrl) {
                let ctx = lay.paintCanvas.getContext('2d');
                ctx.clearRect(0, 0, 1024, 1024);
                if (lay.params && lay.params.paintDataUrl) {
                    let img = new Image();
                    img.onload = () => {
                        ctx.clearRect(0, 0, 1024, 1024);
                        ctx.drawImage(img, 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                        invalidateCaches();
                        requestRender();
                    };
                    img.src = lay.params.paintDataUrl;
                    if (img.complete && img.naturalWidth) {
                        ctx.clearRect(0, 0, 1024, 1024);
                        ctx.drawImage(img, 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                        invalidateCaches();
                    }
                } else {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, 1024, 1024);
                    updatePaintBuffer(lay);
                    lay.isDirty = true;
                    invalidateCaches();
                    requestRender();
                }
            } else if (!lay.paintBufferR) {
                updatePaintBuffer(lay);
            }
        }

        function updatePaintBuffer(lay) {
            if (!lay.paintCanvas) return;
            let w = lay.paintCanvas.width;
            let h = lay.paintCanvas.height;
            let ctx = lay.paintCanvas.getContext('2d');
            let imgData = ctx.getImageData(0, 0, w, h);
            let data = imgData.data;
            if (!lay.paintBufferR || lay.paintBufferR.length !== w * h) {
                lay.paintBufferR = new Float32Array(w * h);
                lay.paintBufferG = new Float32Array(w * h);
                lay.paintBufferB = new Float32Array(w * h);
            }
            for (let i = 0; i < w * h; i++) {
                let r = data[i * 4] / 255;
                let g = data[i * 4 + 1] / 255;
                let b = data[i * 4 + 2] / 255;
                let a = data[i * 4 + 3] / 255;
                lay.paintBufferR[i] = r * a;
                lay.paintBufferG[i] = g * a;
                lay.paintBufferB[i] = b * a;
            }
        }

        function drawBrushDot(lay, x, y, pressure = 1, targetCtx = null) {
            ensureLayerPaintCanvas(lay);
            let lp = lay.params;
            let size = lp.brushSize || 20;
            let softness = lp.brushSoftness !== undefined ? lp.brushSoftness : 0.5;
            let tool = lp.brushTool || 'brush';

            const dynamicPressure = Math.pow(pressure, 0.5);
            const finalSize = size * (0.1 + 0.9 * dynamicPressure);

            let pCtx = targetCtx || lay.paintCanvas.getContext('2d');

            pCtx.save();
            pCtx.globalAlpha = 1.0;

            let color = tool === 'eraser' ? '#ffffff' : (lp.brushColor || '#ffffff');
            pCtx.fillStyle = color;

            const effectiveSoftness = softness <= 0.05 ? 0 : softness;
            if (effectiveSoftness > 0) {
                pCtx.shadowColor = color;
                pCtx.shadowBlur = finalSize * effectiveSoftness;
            }

            pCtx.beginPath();
            pCtx.arc(x, y, finalSize, 0, Math.PI * 2);
            pCtx.fill();
            pCtx.restore();
            
            lay.isDirty = true;
        }

        function drawBrushLineSegment(lay, x0, y0, x1, y1, cpX, cpY, pressure = 1, targetCtx = null) {
            ensureLayerPaintCanvas(lay);
            let lp = lay.params;
            let size = lp.brushSize || 20;
            let softness = lp.brushSoftness !== undefined ? lp.brushSoftness : 0.5;
            let tool = lp.brushTool || 'brush';

            const dynamicPressure = Math.pow(pressure, 0.5);
            const finalSize = size * (0.1 + 0.9 * dynamicPressure);

            let pCtx = targetCtx || lay.paintCanvas.getContext('2d');

            pCtx.save();
            
            pCtx.lineCap = 'round';
            pCtx.lineJoin = 'round';
            pCtx.globalAlpha = 1.0;

            let color = tool === 'eraser' ? '#ffffff' : (lp.brushColor || '#ffffff');
            
            pCtx.strokeStyle = color;
            pCtx.lineWidth = finalSize * 2; // radius to diameter

            const effectiveSoftness = softness <= 0.05 ? 0 : softness;
            if (effectiveSoftness > 0) {
                pCtx.shadowColor = color;
                pCtx.shadowBlur = finalSize * effectiveSoftness;
            }

            pCtx.beginPath();
            pCtx.moveTo(x0, y0);
            if (cpX !== undefined && cpY !== undefined) {
                pCtx.quadraticCurveTo(cpX, cpY, x1, y1);
            } else {
                pCtx.lineTo(x1, y1);
            }
            pCtx.stroke();
            
            pCtx.restore();
            
            lay.isDirty = true;
        }

        // --- PaintModule Centralized Class ---
        class PaintModule {
            constructor() {
                this.wrapper = null;
                this.canvas = null;
            }

            init(wrapperElem, canvasElem) {
                this.wrapper = wrapperElem;
                this.canvas = canvasElem;
            }

            getCoordinates(input, param2, param3) {
                let clientX, clientY, targetCanvas;
                if (typeof input === 'object' && input !== null) {
                    clientX = input.clientX;
                    clientY = input.clientY;
                    if (input.touches && input.touches.length > 0) {
                        clientX = input.touches[0].clientX;
                        clientY = input.touches[0].clientY;
                    }
                    targetCanvas = param2;
                } else {
                    clientX = input;
                    clientY = param2;
                    targetCanvas = param3;
                }

                const canvas = targetCanvas || this.canvas || $('canvas');
                if (!canvas) return { x: 0, y: 0 };

                // Get exact current physical bounding rect of the preview canvas element on screen
                const rect = canvas.getBoundingClientRect();
                if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

                // Target paint bitmap dimensions (lay.paintCanvas is 1024x1024)
                let targetW = 1024;
                let targetH = 1024;
                if (typeof state !== 'undefined' && state && state.layers) {
                    let lay = state.layers.find(l => l.id === state.selectedLayerId);
                    if (lay && lay.paintCanvas) {
                        targetW = lay.paintCanvas.width || 1024;
                        targetH = lay.paintCanvas.height || 1024;
                    }
                }

                let normX = 0;
                let normY = 0;

                // 1. Direct normalized position for unrotated viewport
                if (!viewport || !viewport.angle) {
                    normX = (clientX - rect.left) / rect.width;
                    normY = (clientY - rect.top) / rect.height;
                } else {
                    // 2. Vector offset relative to canvas center for rotated viewport
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const dx = clientX - centerX;
                    const dy = clientY - centerY;

                    // Unrotate
                    const rad = -viewport.angle * Math.PI / 180;
                    const cos = Math.cos(rad);
                    const sin = Math.sin(rad);
                    const rotX = dx * cos - dy * sin;
                    const rotY = dx * sin + dy * cos;

                    const scale = (viewport && viewport.scale) || 1;
                    const cssW = (canvas.offsetWidth || rect.width / scale || 512) * scale;
                    const cssH = (canvas.offsetHeight || rect.height / scale || 512) * scale;

                    normX = rotX / cssW + 0.5;
                    normY = rotY / cssH + 0.5;
                }

                // Map normalized canvas position [0..1] to paint layer bitmap coordinates [0..1024]
                const rx = normX * targetW;
                const ry = normY * targetH;

                return { x: rx, y: ry };
            }

            getPaintCoordinates(input, param2, param3) {
                return this.getCoordinates(input, param2, param3);
            }

            isValidPointer(e) {
                if (e.touches && e.touches.length > 1) return false;
                if (e.targetTouches && e.targetTouches.length > 1) return false;
                if (typeof activeTouchCount !== 'undefined' && activeTouchCount > 1) return false;
                if (typeof touchGesture !== 'undefined' && touchGesture.maxTouches > 1) return false;
                if (e.pointerType === 'touch' && !e.isPrimary) return false;
                return true;
            }
        }

        const paintModule = new PaintModule();
        window.PaintModule = PaintModule;
        window.paintModule = paintModule;

        function getPaintCoordinates(a, b, c) {
            return paintModule.getCoordinates(a, b, c);
        }

        function getPaintCanvasCoordinates(a, b, c) {
            return paintModule.getCoordinates(a, b, c);
        }

        window.getPaintCoordinates = getPaintCoordinates;
        window.getPaintCanvasCoordinates = getPaintCanvasCoordinates;

        window.clearPaintCanvas = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint') return;
            
            ensureLayerPaintCanvas(lay);
            let pCanvas = lay.paintCanvas;
            let pCtx = pCanvas.getContext('2d');
            pCtx.fillStyle = '#000000';
            pCtx.fillRect(0, 0, 1024, 1024);
            
            updatePaintBuffer(lay);
            lay.isDirty = true;
            requestRender();
            commitHistorySnapshot();
        };

        window.updateBrushPreview = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint') return;
            let previewCanvas = $('brushPreview');
            if (!previewCanvas) return;
            let pCtx = previewCanvas.getContext('2d');
            pCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            
            let lp = lay.params;
            let size = lp.brushSize || 20;
            let opacity = (lp.brushOpacity !== undefined ? lp.brushOpacity : 100) / 100;
            let softness = lp.brushSoftness !== undefined ? lp.brushSoftness : 0.5;
            let falloff = lp.brushFalloff !== undefined ? lp.brushFalloff : 1.0;
            let angle = (lp.brushAngle || 0) * (Math.PI / 180);
            let squash = lp.brushSquash !== undefined ? lp.brushSquash : 1.0;
            let spacingVal = (lp.brushSpacing !== undefined ? lp.brushSpacing : 10) / 100;
            let color = lp.brushColor || '#ffffff';
            let tool = lp.brushTool || 'brush';
            
            if (softness <= 0.05 && spacingVal < 0.1) {
                spacingVal = 0.1;
            }
            
            const centerX = previewCanvas.width / 2;
            const centerY = previewCanvas.height / 2;
            
            pCtx.save();
            if (size > 30) {
                const scale = 30 / size;
                pCtx.translate(centerX, centerY);
                pCtx.scale(scale, scale);
                pCtx.translate(-centerX, -centerY);
            }

            const startX = centerX - 25;
            const startY = centerY + 25;
            const endX = centerX + 25;
            const endY = centerY - 25;
            
            const dx = endX - startX;
            const dy = endY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const step = Math.max(1, size * spacingVal);
            const stampAngle = Math.atan2(dy, dx);
            
            for (let i = 0; i <= distance; i += step) {
                const x = startX + Math.cos(stampAngle) * i;
                const y = startY + Math.sin(stampAngle) * i;
                
                pCtx.save();
                pCtx.translate(x, y);
                pCtx.rotate(angle);
                pCtx.scale(1, squash);
                
                pCtx.globalAlpha = opacity;
                pCtx.beginPath();
                
                const effectiveSoftness = softness <= 0.05 ? 0 : softness;
                if (effectiveSoftness > 0) {
                    let rgb = hexToRgb(color);
                    const innerRadius = Math.max(0.001, size * (1 - effectiveSoftness));
                    const grad = pCtx.createRadialGradient(0, 0, innerRadius, 0, 0, size);
                    grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
                    const steps = 5;
                    for (let j = 1; j < steps; j++) {
                        const stepPos = j / steps;
                        const stopOpacity = Math.pow(1 - stepPos, falloff);
                        grad.addColorStop(stepPos, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${stopOpacity.toFixed(3)})`);
                    }
                    grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
                    pCtx.fillStyle = grad;
                } else {
                    pCtx.fillStyle = color;
                }
                pCtx.arc(0, 0, size, 0, Math.PI * 2);
                pCtx.fill();
                pCtx.restore();
            }
            pCtx.restore();
        };

        // --- Progress Loader UI Helpers ---
        function showProgressLoader(title = "Обробка...", subtext = "") {
            let modal = $('progressModal');
            if (modal) {
                let tEl = $('progressTitle');
                let sEl = $('progressSubtext');
                if (tEl) tEl.textContent = title;
                if (sEl) sEl.textContent = subtext;
                modal.style.display = 'flex';
            }
        }

        function updateProgressLoaderSubtext(subtext = "") {
            let sEl = $('progressSubtext');
            if (sEl) sEl.textContent = subtext;
        }

        function hideProgressLoader() {
            let modal = $('progressModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }

        // --- Data Compression: Crop Paint Canvas to Bounding Box & Convert to WebP ---
        function compressPaintCanvas(canvas) {
            if (!canvas) return { dataUrl: null, crop: null };
            let w = canvas.width, h = canvas.height;
            let ctx = canvas.getContext('2d');
            let imgData = ctx.getImageData(0, 0, w, h);
            let data = imgData.data;

            let minX = w, minY = h, maxX = -1, maxY = -1;
            let hasPixels = false;

            // 4px step scan for ultra-fast bounding box estimation
            for (let y = 0; y < h; y += 4) {
                for (let x = 0; x < w; x += 4) {
                    let idx = (y * w + x) * 4;
                    if (data[idx + 3] > 0 && (data[idx] > 2 || data[idx + 1] > 2 || data[idx + 2] > 2)) {
                        hasPixels = true;
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (!hasPixels) {
                return { dataUrl: null, crop: null };
            }

            // Expand bounding box slightly to avoid cutting smooth brush anti-aliasing edges
            minX = Math.max(0, minX - 4);
            minY = Math.max(0, minY - 4);
            maxX = Math.min(w - 1, maxX + 4);
            maxY = Math.min(h - 1, maxY + 4);

            let bw = maxX - minX + 1;
            let bh = maxY - minY + 1;

            let temp = document.createElement('canvas');
            temp.width = bw;
            temp.height = bh;
            let tCtx = temp.getContext('2d');
            tCtx.drawImage(canvas, minX, minY, bw, bh, 0, 0, bw, bh);

            let dataUrl = temp.toDataURL('image/webp', 0.85);
            if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
                dataUrl = temp.toDataURL('image/png');
            }

            let crop = (bw === w && bh === h && minX === 0 && minY === 0) ? null : { x: minX, y: minY, w: bw, h: bh };

            return { dataUrl, crop };
        }

        function prepareStateForSerialization() {
            if (!state) return;
            if (state.layers) {
                state.layers.forEach(lay => {
                    if (lay.generatorType === 'paint') {
                        ensureLayerPaintCanvas(lay);
                        if (lay.paintCanvas) {
                            let comp = compressPaintCanvas(lay.paintCanvas);
                            if (lay.params) {
                                lay.params.paintDataUrl = comp.dataUrl;
                                lay.params.paintCrop = comp.crop;
                            }
                        }
                    }
                });
            }
            if (typeof tilingState !== 'undefined' && tilingState) {
                state.tilingState = JSON.parse(JSON.stringify(tilingState));
                if (tilingState.customImageLoaded && typeof tilingOriginalCanvas !== 'undefined' && tilingOriginalCanvas && tilingOriginalCanvas.width > 0) {
                    try {
                        state.tilingCustomImageDataUrl = tilingOriginalCanvas.toDataURL('image/png');
                    } catch(e) {}
                } else {
                    state.tilingCustomImageDataUrl = null;
                }
            }
            if (window.mapGeneratorTab && typeof window.mapGeneratorTab.getPbrState === 'function') {
                state.pbrState = window.mapGeneratorTab.getPbrState();
            }
        }

        function serializeState(s) {
            prepareStateForSerialization();
            return JSON.stringify(s, (key, value) => {
                if (key === 'paintCanvas' || key === 'paintBuffer' || key.startsWith('_')) {
                    return undefined;
                }
                return value;
            });
        }

        // --- Fast Re-hydration with createImageBitmap + Promise.all ---
        async function loadImageBitmapFromDataUrl(dataUrl) {
            if (!dataUrl) return null;
            try {
                if (typeof fetch === 'function' && typeof createImageBitmap === 'function') {
                    const res = await fetch(dataUrl);
                    const blob = await res.blob();
                    return await createImageBitmap(blob);
                }
            } catch (e) {
                // Fallback to standard Image
            }
            return new Promise(resolve => {
                let img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = dataUrl;
            });
        }

        async function rehydrateAllPaintLayersAsync(layers) {
            if (!layers || !Array.isArray(layers)) return;
            let paintLayers = layers.filter(l => l.generatorType === 'paint');
            if (paintLayers.length === 0) return;

            let promises = paintLayers.map(async (lay) => {
                ensureLayerPaintCanvas(lay, false);
                let pCtx = lay.paintCanvas.getContext('2d');
                pCtx.fillStyle = '#000000';
                pCtx.fillRect(0, 0, 1024, 1024);

                if (lay.params && lay.params.paintDataUrl) {
                    let dataUrl = lay.params.paintDataUrl;
                    let crop = lay.params.paintCrop;
                    let bitmap = await loadImageBitmapFromDataUrl(dataUrl);
                    if (bitmap) {
                        if (crop && typeof crop.x === 'number') {
                            pCtx.drawImage(bitmap, crop.x, crop.y, crop.w, crop.h);
                        } else {
                            pCtx.drawImage(bitmap, 0, 0, 1024, 1024);
                        }
                        if (typeof bitmap.close === 'function') bitmap.close();
                    }
                }
                updatePaintBuffer(lay);
                lay.isDirty = true;
            });

            await Promise.all(promises);
        }

        // --- Non-blocking Asynchronous Project Loader ---
        async function loadProjectObjectAsync(p) {
            if (!p || !p.layers || !Array.isArray(p.layers)) {
                throw new Error("Невірна структура файлу проєкту (відсутній масив layers)");
            }

            showProgressLoader("Завантаження проєкту...", "Підготовка шарів...");
            await new Promise(res => setTimeout(res, 30));

            setState(p);
            state.global = Object.assign(freshGlobalSettings(), state.global || {});
            if (!state.global.warps) state.global.warps = [];

            if (state.layers) {
                state.layers.forEach(l => {
                    l.isDirty = true;
                    l.params = Object.assign(freshLayerParams(), l.params || {});
                    if (!l.params.warps) l.params.warps = [];
                });
            }

            if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
            }

            updateProgressLoaderSubtext("Декодування растрових зображень...");
            await new Promise(res => setTimeout(res, 20));
            await rehydrateAllPaintLayersAsync(state.layers);

            updateProgressLoaderSubtext("Оновлення рендеру...");
            await new Promise(res => setTimeout(res, 20));

            invalidateCaches();
            renderLayers();

            if (p.tilingState) {
                tilingState = JSON.parse(JSON.stringify(p.tilingState));
            }
            if (p.tilingCustomImageDataUrl) {
                let img = new Image();
                img.onload = () => {
                    if (!tilingOriginalCanvas) tilingOriginalCanvas = document.createElement('canvas');
                    tilingOriginalCanvas.width = img.width;
                    tilingOriginalCanvas.height = img.height;
                    let octx = tilingOriginalCanvas.getContext('2d');
                    octx.drawImage(img, 0, 0);
                    tilingState.hasImage = true;
                    tilingState.customImageLoaded = true;
                    runTilingPipeline();
                    if (currentTab === 'tiling') { renderTilingPanel(); renderTilingView(); }
                };
                img.src = p.tilingCustomImageDataUrl;
            } else if (tilingState.hasImage) {
                runTilingPipeline();
            }

            if (p.pbrState && window.mapGeneratorTab && typeof window.mapGeneratorTab.loadPbrState === 'function') {
                window.mapGeneratorTab.loadPbrState(p.pbrState);
            }

            if (typeof currentTab !== 'undefined' && currentTab === 'global') {
                renderGlobal();
            } else if (typeof currentTab !== 'undefined' && currentTab === 'tiling') {
                renderTilingPanel();
                renderTilingView();
            } else if (typeof currentTab !== 'undefined' && currentTab === 'maps' && window.mapGeneratorTab) {
                window.mapGeneratorTab.renderRightPanelControls();
            } else {
                renderProps();
            }
            requestRender();
            initHistory();

            hideProgressLoader();
        }

        let isPainting = false;
        let lastPaintX = 0, lastPaintY = 0;
        let smoothedPressure = 1;
        let paintMoved = false;
        let paintPoints = []; // Stores raw pointer coordinates of the current stroke
        let paintQueue = [];  // Queue for processing inputs in requestAnimationFrame
        let paintAnimationFrameId = null;

        let strokeCanvas = null;
        let strokeBackupCanvas = null;
        let strokeBackupActive = false;

        function cancelPainting() {
            clearTimeout(historyTimer);
            isPainting = false;
            paintPoints = [];
            paintQueue = [];
            if (paintAnimationFrameId) {
                cancelAnimationFrame(paintAnimationFrameId);
                paintAnimationFrameId = null;
            }
            if (strokeBackupActive) {
                strokeBackupActive = false;
                let lay = state.layers.find(l => l.id === state.selectedLayerId);
                if (lay && lay.generatorType === 'paint' && lay.paintCanvas) {
                    let pCtx = lay.paintCanvas.getContext('2d');
                    pCtx.clearRect(0, 0, 1024, 1024);
                    pCtx.drawImage(getStrokeBackupCanvas(), 0, 0);
                    let sCtx = getStrokeCanvas().getContext('2d');
                    sCtx.clearRect(0, 0, 1024, 1024);
                    if (lay.params) {
                        lay.params.paintDataUrl = lay.paintCanvas.toDataURL();
                    }
                    updatePaintBuffer(lay);
                    lay.isDirty = true;
                    invalidateCaches();
                    requestRender();
                }
            }
        }

        function getStrokeCanvas() {
            if (!strokeCanvas) {
                strokeCanvas = document.createElement('canvas');
                strokeCanvas.width = 1024;
                strokeCanvas.height = 1024;
            }
            return strokeCanvas;
        }

        function getStrokeBackupCanvas() {
            if (!strokeBackupCanvas) {
                strokeBackupCanvas = document.createElement('canvas');
                strokeBackupCanvas.width = 1024;
                strokeBackupCanvas.height = 1024;
            }
            return strokeBackupCanvas;
        }

        function combineStrokeAndBackup(lay, opacity) {
            let pCanvas = lay.paintCanvas;
            let pCtx = pCanvas.getContext('2d');
            pCtx.clearRect(0, 0, 1024, 1024);
            pCtx.drawImage(getStrokeBackupCanvas(), 0, 0);

            pCtx.save();
            pCtx.globalAlpha = opacity;
            let lp = lay.params;
            let tool = lp.brushTool || 'brush';
            if (tool === 'eraser') {
                pCtx.globalCompositeOperation = 'destination-out';
            } else {
                pCtx.globalCompositeOperation = 'source-over';
            }
            pCtx.drawImage(getStrokeCanvas(), 0, 0);
            pCtx.restore();
            
            lay.isDirty = true;
        }

        function handleCanvasPointerDown(e) {
            if (currentTab === 'tiling') {
                if (!paintModule.isValidPointer(e) || (e.touches && e.touches.length > 1) || (typeof activeTouchCount !== 'undefined' && activeTouchCount > 1) || (touchGesture && touchGesture.maxTouches > 1)) {
                    cancelStamping();
                    cancelMaskBrushing();
                    return;
                }
                if (selectingStampSource || e.shiftKey || e.altKey) {
                    let pos = getCanvasPos(e);
                    initialStampSource = { x: pos.x, y: pos.y };
                    stampSource = { x: pos.x, y: pos.y };
                    selectingStampSource = false;
                    renderTilingPanel();
                    renderTilingView();
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }

                if (tilingState.stamp_enable) {
                    if (!stampSource && tilingState.stamp_mode !== 'erase') {
                        alert('Спочатку оберіть джерело клонування! Натисніть кнопку "🎯 Обрати точку джерела" або затисніть SHIFT та торкніться полотна.');
                        return;
                    }
                    isStamping = true;
                    backupTilingStamp();
                    let pos = getCanvasPos(e);
                    lastDrawPos = { x: pos.x, y: pos.y };
                    stampCursorX = pos.x; stampCursorY = pos.y;
                    applyTilingStamp(pos.x, pos.y, stampSource ? stampSource.x : pos.x, stampSource ? stampSource.y : pos.y);
                    renderTilingView();
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }

                if (tilingState.mask_brush_enable) {
                    isMaskBrushing = true;
                    backupTilingMask();
                    let pos = getCanvasPos(e);
                    stampCursorX = pos.x; stampCursorY = pos.y;
                    applyTilingMaskBrush(pos.x, pos.y);
                    runTilingPipeline();
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
            }

            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint' || !lay.visible) return;

            if (e.button !== 0 || e.shiftKey) return;

            if (!paintModule.isValidPointer(e)) {
                cancelPainting();
                return;
            }

            if (isPainting) {
                cancelPainting();
                return;
            }

            viewport.isDragging = false;

            isPainting = true;
            strokeBackupActive = true;
            paintMoved = false;

            ensureLayerPaintCanvas(lay);

            let pos = getPaintCanvasCoordinates(e.clientX, e.clientY);
            lastPaintX = pos.x;
            lastPaintY = pos.y;

            let rawPressure = (e.pointerType === 'pen' && e.pressure > 0) ? e.pressure : 1;
            smoothedPressure = rawPressure;

            // Initialize point history with start point
            paintPoints = [{ x: pos.x, y: pos.y, pressure: rawPressure }];
            paintQueue = [];

            // Prepare offscreen stroke canvases
            let sCanvas = getStrokeCanvas();
            let sCtx = sCanvas.getContext('2d');
            sCtx.clearRect(0, 0, 1024, 1024);

            let bCanvas = getStrokeBackupCanvas();
            let bCtx = bCanvas.getContext('2d');
            bCtx.clearRect(0, 0, 1024, 1024);
            bCtx.drawImage(lay.paintCanvas, 0, 0);

            // Draw a single dot immediately on press onto stroke canvas
            drawBrushDot(lay, pos.x, pos.y, rawPressure, sCtx);
            
            // Combine stroke and backup onto the active layer
            let lp = lay.params;
            let opacity = (lp.brushOpacity !== undefined ? lp.brushOpacity : 100) / 100;
            combineStrokeAndBackup(lay, opacity);

            // Queue immediate render of the dot
            updatePaintBuffer(lay);
            requestRender();

            // Start processing the paint movement queue in animation frames
            if (!paintAnimationFrameId) {
                paintAnimationFrameId = requestAnimationFrame(processPaintQueue);
            }

            e.stopPropagation();
            e.preventDefault();
        }

        function handleCanvasPointerMove(e) {
            if (currentTab === 'tiling') {
                if (!paintModule.isValidPointer(e) || (e.touches && e.touches.length > 1) || (typeof activeTouchCount !== 'undefined' && activeTouchCount > 1) || (touchGesture && touchGesture.maxTouches > 1)) {
                    cancelStamping();
                    cancelMaskBrushing();
                    renderTilingView();
                    return;
                }
                let pos = getCanvasPos(e);
                stampCursorX = pos.x; stampCursorY = pos.y;

                if (isStamping && tilingState.stamp_enable) {
                    if (tilingState.stamp_mode === 'erase') {
                        applyTilingStamp(pos.x, pos.y, pos.x, pos.y);
                    } else if (stampSource && lastDrawPos) {
                        let dx = pos.x - lastDrawPos.x;
                        let dy = pos.y - lastDrawPos.y;
                        if (tilingState.stamp_aligned) {
                            stampSource.x += dx;
                            stampSource.y += dy;
                        } else if (initialStampSource) {
                            stampSource = { x: initialStampSource.x, y: initialStampSource.y };
                        }
                        applyTilingStamp(pos.x, pos.y, stampSource.x, stampSource.y);
                    }
                    lastDrawPos = { x: pos.x, y: pos.y };
                    renderTilingView();
                } else if (isMaskBrushing && tilingState.mask_brush_enable) {
                    applyTilingMaskBrush(pos.x, pos.y);
                    runTilingPipeline();
                } else {
                    renderTilingView();
                }
                return;
            }

            if (!isPainting) return;

            if (!paintModule.isValidPointer(e)) {
                cancelPainting();
                return;
            }

            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint') {
                cancelPainting();
                return;
            }

            let pos = getPaintCanvasCoordinates(e.clientX, e.clientY);
            paintMoved = true;

            let rawPressure = e.pointerType === 'pen' ? e.pressure : 1;
            if (e.pointerType === 'pen' && rawPressure <= 0) rawPressure = 0.1;

            // Smooth pressure values
            smoothedPressure = smoothedPressure * 0.88 + rawPressure * 0.12;

            // Push event into the queue to be processed on requestAnimationFrame
            paintQueue.push({ x: pos.x, y: pos.y, pressure: smoothedPressure });

            e.stopPropagation();
            e.preventDefault();
        }

        function processPaintQueue() {
            if (!isPainting && paintQueue.length === 0) {
                paintAnimationFrameId = null;
                return;
            }

            if (activeTouchCount > 1 || touchGesture.maxTouches > 1) {
                cancelPainting();
                return;
            }

            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || lay.generatorType !== 'paint') {
                cancelPainting();
                return;
            }

            let updated = false;
            let sCtx = getStrokeCanvas().getContext('2d');

            while (paintQueue.length > 0) {
                let pt = paintQueue.shift();
                let lastPt = paintPoints[paintPoints.length - 1];

                // Ignore points that are extremely close to the last one
                if (lastPt && Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y) < 0.5) {
                    continue;
                }

                paintPoints.push(pt);
                updated = true;

                if (paintPoints.length === 2) {
                    // Two points: simple line segment between first and second point
                    drawBrushLineSegment(lay, lastPt.x, lastPt.y, pt.x, pt.y, undefined, undefined, pt.pressure, sCtx);
                } else if (paintPoints.length > 2) {
                    // Three or more points: draw smooth quadratic curve between midpoints
                    let p2 = paintPoints[paintPoints.length - 1]; // current point
                    let p1 = paintPoints[paintPoints.length - 2]; // control point
                    let p0 = paintPoints[paintPoints.length - 3]; // previous point

                    let midX0 = (p0.x + p1.x) / 2;
                    let midY0 = (p0.y + p1.y) / 2;
                    let midX1 = (p1.x + p2.x) / 2;
                    let midY1 = (p1.y + p2.y) / 2;

                    drawBrushLineSegment(lay, midX0, midY0, midX1, midY1, p1.x, p1.y, p1.pressure, sCtx);
                }
            }

            if (updated) {
                let lp = lay.params;
                let opacity = (lp.brushOpacity !== undefined ? lp.brushOpacity : 100) / 100;
                combineStrokeAndBackup(lay, opacity);
                updatePaintBuffer(lay);
                requestRender();
            }

            if (isPainting) {
                paintAnimationFrameId = requestAnimationFrame(processPaintQueue);
            } else {
                paintAnimationFrameId = null;
            }
        }

        function handleCanvasPointerUp(e) {
            if (currentTab === 'tiling') {
                if (isStamping) {
                    isStamping = false;
                    if (initialStampSource && stampSource) {
                        stampSource = { x: initialStampSource.x, y: initialStampSource.y };
                    }
                    commitHistorySnapshot();
                }
                if (isMaskBrushing) {
                    isMaskBrushing = false;
                    commitHistorySnapshot();
                }
                renderTilingView();
                return;
            }

            if (!isPainting) return;

            if (!paintModule.isValidPointer(e)) {
                cancelPainting();
                return;
            }

            isPainting = false;
            strokeBackupActive = false;
            
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (lay && lay.generatorType === 'paint') {
                let sCtx = getStrokeCanvas().getContext('2d');
                // Connect the last midpoint to the final point to complete the line beautifully
                if (paintPoints.length > 1) {
                    let lastPt = paintPoints[paintPoints.length - 1];
                    let prevPt = paintPoints[paintPoints.length - 2];
                    let midX = (prevPt.x + lastPt.x) / 2;
                    let midY = (prevPt.y + lastPt.y) / 2;
                    drawBrushLineSegment(lay, midX, midY, lastPt.x, lastPt.y, undefined, undefined, lastPt.pressure, sCtx);
                }
                
                let lp = lay.params;
                let opacity = (lp.brushOpacity !== undefined ? lp.brushOpacity : 100) / 100;
                combineStrokeAndBackup(lay, opacity);
                updatePaintBuffer(lay);
                commitHistorySnapshot();
            }

            paintPoints = [];
            paintQueue = [];
        }

        function evalGenerator(type, tx, ty, sx, sy, p, cymaticsSources = null, lay = null) {
            let v = 0.5;
            switch(type){
                case 'paint': {
                    if (lay && lay.paintBuffer) {
                        let scaleFactorX = (sx || 10) / 10;
                        let scaleFactorY = (sy || 10) / 10;
                        let stx = (tx - 0.5) * scaleFactorX + 0.5;
                        let sty = (ty - 0.5) * scaleFactorY + 0.5;
                        let px = (stx % 1 + 1) % 1;
                        let py = (sty % 1 + 1) % 1;
                        let pw = 1024;
                        let ph = 1024;
                        let x = px * (pw - 1);
                        let y = py * (ph - 1);
                        let x0 = Math.floor(x);
                        let y0 = Math.floor(y);
                        let x1 = Math.min(pw - 1, x0 + 1);
                        let y1 = Math.min(ph - 1, y0 + 1);
                        let fx = x - x0;
                        let fy = y - y0;
                        let v00 = lay.paintBuffer[y0 * pw + x0];
                        let v10 = lay.paintBuffer[y0 * pw + x1];
                        let v01 = lay.paintBuffer[y1 * pw + x0];
                        let v11 = lay.paintBuffer[y1 * pw + x1];
                        v = (1 - fy) * ((1 - fx) * v00 + fx * v10) + fy * ((1 - fx) * v01 + fx * v11);
                    } else {
                        v = 0;
                    }
                    break;
                }
                case 'gradient': v = ProceduralGradient.eval(tx, ty, p, sx, sy); break;
                case 'cymatics': v = Cymatics.noise(tx, ty, p, cymaticsSources, sx, sy); break;
                case 'simplex': v = Simplex.eval(tx, ty, sx, sy, p); break;
                case 'perlin': v=(Perlin.noise(tx*sx,ty*sy)+1)/2; break;
                case 'voronoi': v=Voronoi.noise(tx*sx,ty*sy,p.mode||'f1',p.metric||'euclidean',p.distExp||2); break;
                case 'fbm': v=fbm(tx*sx,ty*sy,p.octaves||3,p.lacunarity??2,p.gain??0.5,'simplex'); break;
                case 'ridged': v=ridged(tx*sx,ty*sy,p.octaves||3,p.lacunarity??2,p.gain??0.5,p); break;
                case 'sine': v = SinusoidGenerator.eval(tx, ty, sx, sy, p); break;
                case 'heartbeat': v = HeartbeatGenerator.eval(tx, ty, sx, sy, p); break;
                case 'matrix_digits': v = MatrixDigitGenerator.eval(tx, ty, sx, sy, p); break;
                case 'radial': {
                    let cx = p.centerX ?? 0.5, cy = p.centerY ?? 0.5;
                    let rdx = (tx - cx) * sx, rdy = (ty - cy) * sy;
                    let dc = Math.sqrt(rdx * rdx + rdy * rdy);
                    v = (Math.sin(dc * Math.PI * 2) + 1) / 2;
                    break;
                }
                case 'spiral': {
                    let cx = p.centerX ?? 0.5, cy = p.centerY ?? 0.5;
                    let sdx = (tx - cx) * sx, sdy = (ty - cy) * sy;
                    let ds = Math.sqrt(sdx * sdx + sdy * sdy);
                    let as = Math.atan2(sdy, sdx);
                    v = (Math.sin(ds * Math.PI * 2 + as * (p.octaves || 3)) + 1) / 2;
                    break;
                }
                case 'hexagon': let hc=Math.cos(tx*sx*Math.PI*2)+Math.cos((tx*sx*0.5+ty*sy*0.866025)*Math.PI*2)+Math.cos((tx*sx*0.5-ty*sy*0.866025)*Math.PI*2); v=(hc+1.5)/4.5; break;
                case 'pixel_noise': {
                    let gap = p.pixelGap !== undefined ? Math.max(0, p.pixelGap) : 0.0;
                    let gapVal = p.pixelGapValue !== undefined ? p.pixelGapValue : 0.0;
                    let gapSoft = p.pixelGapSoftness !== undefined ? Math.max(0, p.pixelGapSoftness) : 0.0;
                    let shape = p.pixelShape || 'square';
                    let cornerR = p.pixelCornerRadius !== undefined ? p.pixelCornerRadius : 0.1;
                    let gridType = p.pixelGridType || 'standard';
                    let distType = p.pixelDistribution || 'uniform';
                    let thresh = p.pixelThreshold !== undefined ? p.pixelThreshold : 0.5;
                    let steps = p.pixelSteps || 4;
                    let bevel = p.pixelBevel !== undefined ? p.pixelBevel : 0.0;
                    let bevelType = p.pixelBevelType || 'pyramid';
                    let seed = p.pixelSeed || 0;

                    let gx = tx * (sx || 10);
                    let gy = ty * (sy || 10);

                    let iyRaw = Math.floor(gy);
                    let ixRaw = Math.floor(gx);

                    if (gridType === 'staggered_h') {
                        if (Math.abs(iyRaw) % 2 === 1) gx += 0.5;
                    } else if (gridType === 'staggered_v') {
                        if (Math.abs(ixRaw) % 2 === 1) gy += 0.5;
                    }

                    let ix = Math.floor(gx);
                    let iy = Math.floor(gy);

                    let fx = gx - ix;
                    let fy = gy - iy;

                    let cx = fx - 0.5;
                    let cy = fy - 0.5;

                    let h1 = Voronoi.hash(ix + seed * 1013, iy + seed * 31337);
                    let cellVal = h1;

                    if (distType === 'binary') {
                        cellVal = h1 < thresh ? 0.0 : 1.0;
                    } else if (distType === 'stepped') {
                        let st = Math.max(2, steps);
                        cellVal = Math.floor(h1 * st) / (st - 1);
                    } else if (distType === 'gaussian') {
                        let h2 = Voronoi.hash(ix * 3 + 17 + seed * 101, iy * 7 + 19 + seed * 307);
                        cellVal = (h1 + h2) * 0.5;
                    } else if (distType === 'dither') {
                        let checker = (Math.abs(ix + iy) % 2 === 0) ? 0.8 : 0.2;
                        cellVal = h1 * 0.6 + checker * 0.4;
                    }

                    if (gap <= 0.0001 && shape === 'square' && bevel <= 0.001) {
                        v = cellVal;
                        break;
                    }

                    let halfSize = 0.5 - gap * 0.5;
                    if (halfSize <= 0.0001) {
                        v = gapVal;
                        break;
                    }

                    let d = 0;
                    if (shape === 'circle') {
                        d = Math.sqrt(cx * cx + cy * cy);
                    } else if (shape === 'diamond') {
                        d = Math.abs(cx) + Math.abs(cy);
                    } else if (shape === 'round') {
                        let r = Math.min(cornerR, halfSize);
                        let qx = Math.max(Math.abs(cx) - (halfSize - r), 0);
                        let qy = Math.max(Math.abs(cy) - (halfSize - r), 0);
                        d = Math.sqrt(qx * qx + qy * qy) + (halfSize - r);
                    } else {
                        d = Math.max(Math.abs(cx), Math.abs(cy));
                    }

                    if (bevel > 0.001 && d < halfSize) {
                        let edgeDist = 1.0 - (d / halfSize);
                        let bevelShade = 1.0;
                        if (bevelType === 'pyramid') {
                            bevelShade = 0.35 + 0.65 * Math.pow(Math.max(0, edgeDist), 0.7 * bevel);
                        } else if (bevelType === 'soft') {
                            let sinShade = 0.5 + 0.5 * Math.sin((edgeDist - 0.5) * Math.PI);
                            bevelShade = (1.0 - bevel) + sinShade * bevel;
                        } else if (bevelType === 'inset') {
                            bevelShade = 1.0 - (1.0 - Math.max(0, edgeDist)) * bevel * 0.7;
                        }
                        cellVal = Math.max(0, Math.min(1, cellVal * bevelShade));
                    }

                    if (gap > 0.0001) {
                        if (d >= halfSize) {
                            v = gapVal;
                        } else {
                            let fadeZone = gapSoft > 0.0001 ? gapSoft * halfSize * 0.5 : 0;
                            let innerEdge = halfSize - fadeZone;
                            if (fadeZone > 0 && d > innerEdge) {
                                let t = (d - innerEdge) / fadeZone;
                                let smoothT = t * t * (3 - 2 * t);
                                v = cellVal * (1 - smoothT) + gapVal * smoothT;
                            } else {
                                v = cellVal;
                            }
                        }
                    } else {
                        if (d > halfSize + 0.0001) {
                            v = gapVal;
                        } else {
                            v = cellVal;
                        }
                    }
                    break;
                }
                case 'white_noise': v=Voronoi.hash(Math.floor(tx*sx*256)+(p.seed||0)*31, Math.floor(ty*sy*256)+(p.seed||0)*17); break;
                case 'checkerboard': v=(Math.floor(tx*sx)+Math.floor(ty*sy))%2===0?1:0; break;
                case 'dots': {
                    let gx = tx * (sx || 10);
                    let gy = ty * (sy || 10);

                    let ix = Math.floor(gx);
                    let iy = Math.floor(gy);

                    let fx = gx - ix;
                    let fy = gy - iy;

                    if (p.dotGrid === 'staggered' || p.dotGrid === 'hex') {
                        let isOdd = Math.abs(iy) % 2 === 1;
                        if (isOdd) {
                            fx += 0.5;
                            if (fx >= 1) fx -= 1;
                        }
                    }

                    let rdx = fx - 0.5;
                    let rdy = fy - 0.5;

                    let shape = p.dotShape || 'circle';
                    let d = 0;
                    if (shape === 'square') {
                        d = Math.max(Math.abs(rdx), Math.abs(rdy));
                    } else if (shape === 'diamond') {
                        d = Math.abs(rdx) + Math.abs(rdy);
                    } else {
                        d = Math.sqrt(rdx * rdx + rdy * rdy);
                    }

                    let radius = p.dotSize !== undefined ? p.dotSize : 0.25;
                    let softness = p.dotSoftness !== undefined ? p.dotSoftness : 0.05;

                    if (softness <= 0.001) {
                        v = d < radius ? 1 : 0;
                    } else {
                        let rOuter = radius;
                        let rInner = Math.max(0, radius * (1 - softness));
                        if (d <= rInner) {
                            v = 1;
                        } else if (d >= rOuter) {
                            v = 0;
                        } else {
                            let t = (d - rInner) / (rOuter - rInner);
                            v = 1 - (t * t * (3 - 2 * t));
                        }
                    }
                    break;
                }
                case 'weave': let wx=Math.sin(tx*sx*Math.PI*2), wy=Math.sin(ty*sy*Math.PI*2); v=(wx*wy+1)/2; break;
                case 'value_noise': 
                    let ix=Math.floor(tx*sx), iy=Math.floor(ty*sy), fx=(tx*sx)-ix, fy=(ty*sy)-iy;
                    let v00=Voronoi.hash(ix,iy), v10=Voronoi.hash(ix+1,iy), v01=Voronoi.hash(ix,iy+1), v11=Voronoi.hash(ix+1,iy+1);
                    v=Perlin.lerp(Perlin.fade(fy), Perlin.lerp(Perlin.fade(fx),v00,v10), Perlin.lerp(Perlin.fade(fx),v01,v11)); break;
                case 'cellular': v=1-Voronoi.noise(tx*sx,ty*sy,'f1'); break;
                case 'spider_web': {
                    let ux = (tx - 0.5) * (sx / 10);
                    let uy = (ty - 0.5) * (sy / 10);
                    let r = Math.sqrt(ux*ux + uy*uy);
                    let a = Math.atan2(uy, ux);
                    let radSineAmp = p.radSineAmp !== undefined ? p.radSineAmp : 0;
                    let radSineFreq = p.radSineFreq !== undefined ? p.radSineFreq : 10;
                    let ringSineAmp = p.ringSineAmp !== undefined ? p.ringSineAmp : 0;
                    let ringSineFreq = p.ringSineFreq !== undefined ? p.ringSineFreq : 5;
                    let jitter = p.jitter || 8;
                    let wobble = p.wobble || 0.03;
                    let fractal = p.fractal || 0;
                    let radialCount = p.radialCount || 18;
                    let radThick = p.radThick !== undefined ? p.radThick : 0.025;
                    let ringCount = p.ringCount || 22;
                    let ringThick = p.ringThick !== undefined ? p.ringThick : 0.04;
                    let enableRays = p.enableRays !== undefined ? p.enableRays : true;
                    let enableRings = p.enableRings !== undefined ? p.enableRings : true;

                    let radial = 0;
                    if (enableRays) {
                        let rayAngle = a + radSineAmp * Math.sin(r * radSineFreq * 10.0);
                        let d1 = Math.sin(rayAngle * jitter);
                        let mix_val = d1 * (1 - fractal) + (Math.abs(d1) * 2.0 - 1.0) * fractal;
                        let combinedWobble = wobble * mix_val;
                        let rad_arg = ((rayAngle + combinedWobble) / (2.0 * Math.PI)) * radialCount;
                        let rad_fract = rad_arg - Math.floor(rad_arg);
                        radial = Math.abs(rad_fract - 0.5);
                        radial = smoothstep(radThick, 0.0, radial);
                    }

                    let ring = 0;
                    if (enableRings) {
                        let ringOffset = ringSineAmp * Math.sin(a * ringSineFreq);
                        let sin_a_jit = Math.sin(a * jitter);
                        let mix_ring = sin_a_jit * (1 - fractal) + Math.abs(sin_a_jit) * fractal;
                        let rr = r + ringOffset + (wobble * mix_ring);
                        let ring_arg = rr * ringCount;
                        let ring_fract = ring_arg - Math.floor(ring_arg);
                        ring = Math.abs(ring_fract - 0.5);
                        ring = smoothstep(ringThick, 0.0, ring);
                    }

                    let fade = smoothstep(0.0, 0.05, r);
                    let edge = 1.0 - smoothstep(0.8, 1.0, r);
                    v = Math.max(radial, ring) * fade * edge;
                    break;
                }
            }
            return v;
        }

        function renderProject(tgtCanvas=null) {
            let isExport = !!tgtCanvas, cv = tgtCanvas||canvas, cx = cv.getContext('2d', { willReadFrequently: true });
            let fullW = cv.width, fullH = cv.height, start = performance.now();
            
            // --- Швидкий превʼю (Draft mode при інтерактивному перетягуванні) ---
            let isDraft = !isExport && isInteracting && lowResOnEdit && (fullW > 256 || fullH > 256);
            let w = isDraft ? 256 : fullW;
            let h = isDraft ? 256 : fullH;

            ensureBuffers(w, h);
            
            let imgData = cx.createImageData(w, h), data = imgData.data;

            const blendBufferR = getGlobalFloatBuffer('blendBufferR', w * h);
            const blendBufferG = getGlobalFloatBuffer('blendBufferG', w * h);
            const blendBufferB = getGlobalFloatBuffer('blendBufferB', w * h);

            const layerBufferR = getGlobalFloatBuffer('layerBufferR', w * h);
            const layerBufferG = getGlobalFloatBuffer('layerBufferG', w * h);
            const layerBufferB = getGlobalFloatBuffer('layerBufferB', w * h);

            const blurTempR = getGlobalFloatBuffer('blurTempR', w * h);
            const blurTempG = getGlobalFloatBuffer('blurTempG', w * h);
            const blurTempB = getGlobalFloatBuffer('blurTempB', w * h);

            const pendingMaskTargetR = getGlobalFloatBuffer('pendingMaskTargetR', w * h);
            const pendingMaskTargetG = getGlobalFloatBuffer('pendingMaskTargetG', w * h);
            const pendingMaskTargetB = getGlobalFloatBuffer('pendingMaskTargetB', w * h);
            const pendingMaskAlphaBuffer = getGlobalFloatBuffer('pendingMaskAlphaBuffer', w * h);

            blendBufferR.fill(0); blendBufferG.fill(0); blendBufferB.fill(0);
            dispBuffer.fill(0.5);

            // --- Dynamic Resolution Metadata ---
            if ($('resolutionInfo')) {
                $('resolutionInfo').textContent = isExport ? `${fullW} × ${fullH}` : (isDraft ? `${fullW} × ${fullH} (Чернетка ${w}×${h})` : `${fullW} × ${fullH}`);
            }

            // --- Глобальна трансформація (Zoom/Rotate/Offset) + глобальний тайлінг ---
            let gZoom = state.global.globalZoom || 1;
            let gScaleX = state.global.globalScaleX !== undefined ? state.global.globalScaleX : 1;
            let gScaleY = state.global.globalScaleY !== undefined ? state.global.globalScaleY : 1;
            let gRot = state.global.globalRotation || 0;
            let gOffX = state.global.globalOffsetX || 0;
            let gOffY = state.global.globalOffsetY || 0;
            let gPerspV = state.global.globalPerspectiveV || 0;
            let gPerspH = state.global.globalPerspectiveH || 0;
            let gTileMode = state.global.tileMode || 'off';
            let gRepX = Math.max(1, state.global.tileRepeatX || 1);
            let gRepY = Math.max(1, state.global.tileRepeatY || 1);
            let gMirX = state.global.tileMirrorX !== false;
            let gMirY = state.global.tileMirrorY !== false;
            let gSeamOffX = state.global.tileSeamOffsetX || 0;
            let gSeamOffY = state.global.tileSeamOffsetY || 0;
            let gForceSeamless = !!state.global.forceSeamless || gTileMode === 'blend';
            let gForceSoftness = state.global.forceSeamlessSoftness ?? 1;
            let gBlendCurve = state.global.blendCurve || 'smooth';

            // --- Шар-маска (Clipping Mask) ---
            let { maskTargetIndex, clippedByMasks } = computeMaskRelationships();
            let pendingRemaining = 0, pendingOp = 1, pendingBlendFn = Blend.normal;

            let firstBlend = true;

            for(let lIdx=state.layers.length-1; lIdx>=0; lIdx--){
                let lay = state.layers[lIdx]; if(!lay.visible) continue;
                let op = lay.opacity/100, bFn = Blend[lay.blendMode] || Blend.normal, p = lay.params;
                let lScale = p.layerScale || 1;

                if (lay.generatorType === 'paint') {
                    ensureLayerPaintCanvas(lay);
                }

                // Per-layer Dual-Caching Mechanism (Draft vs Full Resolution)
                let useLayerCache = !isExport && w <= 1024;
                let needComputeLayer = true;

                if (lay.isDirty) {
                    lay.isDraftDirty = true;
                    lay.isFullDirty = true;
                    lay.isDirty = false;
                }

                let cacheRKey = isDraft ? 'draftBufferR' : 'fullBufferR';
                let cacheGKey = isDraft ? 'draftBufferG' : 'fullBufferG';
                let cacheBKey = isDraft ? 'draftBufferB' : 'fullBufferB';
                let cacheWKey = isDraft ? 'draftW' : 'fullW';
                let cacheHKey = isDraft ? 'draftH' : 'fullH';
                let dirtyKey = isDraft ? 'isDraftDirty' : 'isFullDirty';

                if (useLayerCache) {
                    if (lay[cacheRKey] && !lay[dirtyKey] && lay[cacheWKey] === w && lay[cacheHKey] === h) {
                        needComputeLayer = false;
                        layerBufferR.set(lay[cacheRKey]);
                        layerBufferG.set(lay[cacheGKey]);
                        layerBufferB.set(lay[cacheBKey]);
                    } else {
                        if (!lay[cacheRKey] || lay[cacheRKey].length !== w * h) {
                            lay[cacheRKey] = new Float32Array(w * h);
                            lay[cacheGKey] = new Float32Array(w * h);
                            lay[cacheBKey] = new Float32Array(w * h);
                        }
                        lay[cacheWKey] = w;
                        lay[cacheHKey] = h;
                        lay[dirtyKey] = false;
                    }
                }

                if (needComputeLayer) {
                    let targetBufR = useLayerCache ? lay[cacheRKey] : layerBufferR;
                    let targetBufG = useLayerCache ? lay[cacheGKey] : layerBufferG;
                    let targetBufB = useLayerCache ? lay[cacheBKey] : layerBufferB;

                    let activeCymaticsSources = null;
                    if (lay.generatorType === 'cymatics') {
                        activeCymaticsSources = Cymatics.getSources(p.sourceMode||'Corners', p.sourcesCount||4);
                    }

                    const { lutR, lutG, lutB } = buildLayerColorLUT(p, lay.generatorType);

                    let isGlobalWarpFirst = (state.global.warpOrder === 'warp_first');
                    let hasGlobalTransform = (gZoom !== 1 || gScaleX !== 1 || gScaleY !== 1 || gRot || gOffX || gOffY || gTileMode !== 'off' || gPerspV || gPerspH);
                    let activeGlobalWarps = (state.global.warps || []).filter(w => w && w.type !== 'none' && w.visible !== false);
                    let hasGlobalWarps = activeGlobalWarps.length > 0;

                    let isLayerWarpFirst = (p.warpOrder === 'warp_first');
                    let hasLayerTransform = (lScale !== 1 || p.angle || p.perspectiveV || p.perspectiveH || p.offsetX || p.offsetY);
                    let activeLayerWarps = (p.warps || []).filter(w => w && w.type !== 'none' && w.visible !== false);
                    let hasLayerWarps = activeLayerWarps.length > 0;

                    let grRad = -gRot * Math.PI / 180;
                    let cosGRot = gRot ? Math.cos(grRad) : 1, sinGRot = gRot ? Math.sin(grRad) : 0;

                    let lrRad = -(p.angle || 0) * Math.PI / 180;
                    let cosLRot = p.angle ? Math.cos(lrRad) : 1, sinLRot = p.angle ? Math.sin(lrRad) : 0;

                    for(let y=0; y<h; y++){
                        const baseY = y/h;
                        for(let x=0; x<w; x++){
                            let nx = x/w, ny = baseY, idx = y*w+x;

                            // --- GLOBAL TRANSFORMATION & WARPING ---
                            if (isGlobalWarpFirst) {
                                // 1. Global Warps First
                                if (hasGlobalWarps) {
                                    for (let wIdx = 0; wIdx < activeGlobalWarps.length; wIdx++) {
                                        let wModifier = activeGlobalWarps[wIdx];
                                        let st = Number(wModifier.strength) / 100;
                                        let fq = Math.max(0.1, Number(wModifier.freq) || 4);
                                        let cdx = nx - 0.5, cdy = ny - 0.5;
                                        let cdist = Math.sqrt(cdx*cdx + cdy*cdy);

                                        if (wModifier.type === 'displacement') { 
                                            let mode = wModifier.dispMode || 'height_gradient';
                                            if (mode === 'vector_field') {
                                                let ox = Simplex.noise(nx * fq * 0.5 + 13.5, ny * fq * 0.5 + 27.1);
                                                let oy = Simplex.noise(nx * fq * 0.5 + 71.3, ny * fq * 0.5 + 83.9);
                                                let dispFactor = st * 0.2;
                                                nx += ox * dispFactor;
                                                ny += oy * dispFactor;
                                            } else if (mode === 'directional') {
                                                let h = (Simplex.noise(nx * fq * 0.5, ny * fq * 0.5) + 0.5 * Simplex.noise(nx * fq + 31.7, ny * fq + 53.1)) / 1.5;
                                                let ang = ((wModifier.angle || 0) * Math.PI) / 180;
                                                let dispFactor = h * st * 0.2;
                                                nx += Math.cos(ang) * dispFactor;
                                                ny += Math.sin(ang) * dispFactor;
                                            } else if (mode === 'radial') {
                                                let rcdx = nx - 0.5, rcdy = ny - 0.5;
                                                let rdist = Math.sqrt(rcdx * rcdx + rcdy * rcdy) || 0.001;
                                                let h = (Simplex.noise(nx * fq * 0.5, ny * fq * 0.5) + 0.5 * Simplex.noise(nx * fq + 31.7, ny * fq + 53.1)) / 1.5;
                                                let dispFactor = h * st * 0.2;
                                                nx += (rcdx / rdist) * dispFactor;
                                                ny += (rcdy / rdist) * dispFactor;
                                            } else {
                                                let eps = 0.001;
                                                let px = nx * fq * 0.5, py = ny * fq * 0.5;
                                                let h0 = Simplex.noise(px, py) + 0.5 * Simplex.noise(px * 2 + 13.7, py * 2 + 27.3);
                                                let hR = Simplex.noise(px + eps, py) + 0.5 * Simplex.noise((px + eps) * 2 + 13.7, py * 2 + 27.3);
                                                let hU = Simplex.noise(px, py + eps) + 0.5 * Simplex.noise(px * 2 + 13.7, (py + eps) * 2 + 27.3);
                                                let gradX = (hR - h0) / eps;
                                                let gradY = (hU - h0) / eps;
                                                let dispFactor = st * 0.02;
                                                nx += gradX * dispFactor;
                                                ny += gradY * dispFactor;
                                            }
                                        }
                                        else if (wModifier.type === 'vortex') { 
                                            let a = cdist * st * 15; 
                                            nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a); 
                                            ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a); 
                                        }
                                        else if (wModifier.type === 'twirl') { 
                                            let falloff = Math.max(0, 1 - (cdist / (fq * 0.25))); 
                                            let a = falloff * st * 10;
                                            nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a);
                                            ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a);
                                        }
                                        else if (wModifier.type === 'sine') { 
                                            const waveX = Math.sin(ny * fq * Math.PI) * st * 0.1;
                                            const waveY = Math.cos(nx * fq * Math.PI) * st * 0.1;
                                            nx += waveX; ny += waveY;
                                        }
                                        else if (wModifier.type === 'bulge') { 
                                            let power = Math.exp(-cdist * fq);
                                            let scale = 1 + power * st;
                                            nx = 0.5 + cdx * scale;
                                            ny = 0.5 + cdy * scale;
                                        }
                                        else if (wModifier.type === 'noise') { 
                                            let noX = NoiseCache.get(nx*fq, ny*fq) - 0.5; 
                                            let noY = NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5; 
                                            nx += noX * (st * 0.2); 
                                            ny += noY * (st * 0.2); 
                                        }
                                        else if (wModifier.type === 'domain_warp') {
                                            let offX = (NoiseCache.get(nx*fq, ny*fq) - 0.5) * st;
                                            let offY = (NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5) * st;
                                            nx += offX; ny += offY;
                                        }
                                        else if (wModifier.type === 'distortion') {
                                            nx += Math.sin(cdx * fq * Math.PI) * (st * 0.1);
                                            ny += Math.cos(cdy * fq * Math.PI) * (st * 0.1);
                                        }
                                        else if (wModifier.type === 'polar') {
                                            let r = cdist * fq;
                                            let theta = Math.atan2(cdy, cdx) / (Math.PI * 2);
                                            nx = 0.5 + r * Math.cos(theta * Math.PI * 2) * st;
                                            ny = 0.5 + r * Math.sin(theta * Math.PI * 2) * st;
                                        }
                                        else if (wModifier.type === 'point_deformer') {
                                            if (wModifier.points && wModifier.points.length > 0) {
                                                let pRes = CanvasDeformerManager.transformPointArray(nx * w, ny * h, wModifier.points, w, h);
                                                nx = pRes.x / w;
                                                ny = pRes.y / h;
                                            }
                                        }
                                        else if (wModifier.type === 'zoom_stretch') {
                                            let zRes = CanvasDeformerManager.applyZoomStretch(nx, ny, wModifier);
                                            nx = zRes.nx; ny = zRes.ny;
                                        }
                                    }
                                }
                                // 2. Global Transform
                                if (hasGlobalTransform) {
                                    nx -= 0.5; ny -= 0.5;
                                    if (gZoom !== 1 || gScaleX !== 1 || gScaleY !== 1) {
                                        nx /= (gZoom * gScaleX);
                                        ny /= (gZoom * gScaleY);
                                    }
                                    if (gRot) {
                                        let grx = nx * cosGRot - ny * sinGRot;
                                        let gry = nx * sinGRot + ny * cosGRot;
                                        nx = grx; ny = gry;
                                    }
                                    if (gPerspV || gPerspH) {
                                        let gpv = gPerspV / 200;
                                        let gph = gPerspH / 200;
                                        let gpw = Math.max(0.1, 1 + nx * gph + ny * gpv);
                                        nx /= gpw;
                                        ny /= gpw;
                                    }
                                    nx -= gOffX; ny -= gOffY;
                                    if (gTileMode !== 'off') {
                                        let rx = nx * gRepX + 0.5 + gSeamOffX, ry = ny * gRepY + 0.5 + gSeamOffY;
                                        if (gTileMode === 'wrap' || gTileMode === 'blend') {
                                            rx = wrapFold(rx); ry = wrapFold(ry);
                                        } else if (gTileMode === 'mirror') {
                                            rx = gMirX ? mirrorFold(rx) : wrapFold(rx);
                                            ry = gMirY ? mirrorFold(ry) : wrapFold(ry);
                                        }
                                        nx = rx - 0.5; ny = ry - 0.5;
                                    }
                                    nx += 0.5; ny += 0.5;
                                }
                            } else {
                                // 1. Global Transform First
                                if (hasGlobalTransform) {
                                    nx -= 0.5; ny -= 0.5;
                                    if (gZoom !== 1 || gScaleX !== 1 || gScaleY !== 1) {
                                        nx /= (gZoom * gScaleX);
                                        ny /= (gZoom * gScaleY);
                                    }
                                    if (gRot) {
                                        let grx = nx * cosGRot - ny * sinGRot;
                                        let gry = nx * sinGRot + ny * cosGRot;
                                        nx = grx; ny = gry;
                                    }
                                    if (gPerspV || gPerspH) {
                                        let gpv = gPerspV / 200;
                                        let gph = gPerspH / 200;
                                        let gpw = Math.max(0.1, 1 + nx * gph + ny * gpv);
                                        nx /= gpw;
                                        ny /= gpw;
                                    }
                                    nx -= gOffX; ny -= gOffY;
                                    if (gTileMode !== 'off') {
                                        let rx = nx * gRepX + 0.5 + gSeamOffX, ry = ny * gRepY + 0.5 + gSeamOffY;
                                        if (gTileMode === 'wrap' || gTileMode === 'blend') {
                                            rx = wrapFold(rx); ry = wrapFold(ry);
                                        } else if (gTileMode === 'mirror') {
                                            rx = gMirX ? mirrorFold(rx) : wrapFold(rx);
                                            ry = gMirY ? mirrorFold(ry) : wrapFold(ry);
                                        }
                                        nx = rx - 0.5; ny = ry - 0.5;
                                    }
                                    nx += 0.5; ny += 0.5;
                                }
                                // 2. Global Warps Second
                                if (hasGlobalWarps) {
                                    for (let wIdx = 0; wIdx < activeGlobalWarps.length; wIdx++) {
                                        let wModifier = activeGlobalWarps[wIdx];
                                        let st = Number(wModifier.strength) / 100;
                                        let fq = Math.max(0.1, Number(wModifier.freq) || 4);
                                        let cdx = nx - 0.5, cdy = ny - 0.5;
                                        let cdist = Math.sqrt(cdx*cdx + cdy*cdy);

                                        if (wModifier.type === 'displacement') { 
                                            let mode = wModifier.dispMode || 'height_gradient';
                                            if (mode === 'vector_field') {
                                                let ox = Simplex.noise(nx * fq * 0.5 + 13.5, ny * fq * 0.5 + 27.1);
                                                let oy = Simplex.noise(nx * fq * 0.5 + 71.3, ny * fq * 0.5 + 83.9);
                                                let dispFactor = st * 0.2;
                                                nx += ox * dispFactor;
                                                ny += oy * dispFactor;
                                            } else if (mode === 'directional') {
                                                let h = (Simplex.noise(nx * fq * 0.5, ny * fq * 0.5) + 0.5 * Simplex.noise(nx * fq + 31.7, ny * fq + 53.1)) / 1.5;
                                                let ang = ((wModifier.angle || 0) * Math.PI) / 180;
                                                let dispFactor = h * st * 0.2;
                                                nx += Math.cos(ang) * dispFactor;
                                                ny += Math.sin(ang) * dispFactor;
                                            } else if (mode === 'radial') {
                                                let rcdx = nx - 0.5, rcdy = ny - 0.5;
                                                let rdist = Math.sqrt(rcdx * rcdx + rcdy * rcdy) || 0.001;
                                                let h = (Simplex.noise(nx * fq * 0.5, ny * fq * 0.5) + 0.5 * Simplex.noise(nx * fq + 31.7, ny * fq + 53.1)) / 1.5;
                                                let dispFactor = h * st * 0.2;
                                                nx += (rcdx / rdist) * dispFactor;
                                                ny += (rcdy / rdist) * dispFactor;
                                            } else {
                                                let eps = 0.001;
                                                let px = nx * fq * 0.5, py = ny * fq * 0.5;
                                                let h0 = Simplex.noise(px, py) + 0.5 * Simplex.noise(px * 2 + 13.7, py * 2 + 27.3);
                                                let hR = Simplex.noise(px + eps, py) + 0.5 * Simplex.noise((px + eps) * 2 + 13.7, py * 2 + 27.3);
                                                let hU = Simplex.noise(px, py + eps) + 0.5 * Simplex.noise(px * 2 + 13.7, (py + eps) * 2 + 27.3);
                                                let gradX = (hR - h0) / eps;
                                                let gradY = (hU - h0) / eps;
                                                let dispFactor = st * 0.02;
                                                nx += gradX * dispFactor;
                                                ny += gradY * dispFactor;
                                            }
                                        }
                                        else if (wModifier.type === 'vortex') { 
                                            let a = cdist * st * 15; 
                                            nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a); 
                                            ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a); 
                                        }
                                        else if (wModifier.type === 'twirl') { 
                                            let falloff = Math.max(0, 1 - (cdist / (fq * 0.25))); 
                                            let a = falloff * st * 10;
                                            nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a);
                                            ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a);
                                        }
                                        else if (wModifier.type === 'sine') { 
                                            const waveX = Math.sin(ny * fq * Math.PI) * st * 0.1;
                                            const waveY = Math.cos(nx * fq * Math.PI) * st * 0.1;
                                            nx += waveX; ny += waveY;
                                        }
                                        else if (wModifier.type === 'bulge') { 
                                            let power = Math.exp(-cdist * fq);
                                            let scale = 1 + power * st;
                                            nx = 0.5 + cdx * scale;
                                            ny = 0.5 + cdy * scale;
                                        }
                                        else if (wModifier.type === 'noise') { 
                                            let noX = NoiseCache.get(nx*fq, ny*fq) - 0.5; 
                                            let noY = NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5; 
                                            nx += noX * (st * 0.2); 
                                            ny += noY * (st * 0.2); 
                                        }
                                        else if (wModifier.type === 'domain_warp') {
                                            let offX = (NoiseCache.get(nx*fq, ny*fq) - 0.5) * st;
                                            let offY = (NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5) * st;
                                            nx += offX; ny += offY;
                                        }
                                        else if (wModifier.type === 'distortion') {
                                            nx += Math.sin(cdx * fq * Math.PI) * (st * 0.1);
                                            ny += Math.cos(cdy * fq * Math.PI) * (st * 0.1);
                                        }
                                        else if (wModifier.type === 'polar') {
                                            let r = cdist * fq;
                                            let theta = Math.atan2(cdy, cdx) / (Math.PI * 2);
                                            nx = 0.5 + r * Math.cos(theta * Math.PI * 2) * st;
                                            ny = 0.5 + r * Math.sin(theta * Math.PI * 2) * st;
                                        }
                                        else if (wModifier.type === 'point_deformer') {
                                            if (wModifier.points && wModifier.points.length > 0) {
                                                let pRes = CanvasDeformerManager.transformPointArray(nx * w, ny * h, wModifier.points, w, h);
                                                nx = pRes.x / w;
                                                ny = pRes.y / h;
                                            }
                                        }
                                        else if (wModifier.type === 'zoom_stretch') {
                                            let zRes = CanvasDeformerManager.applyZoomStretch(nx, ny, wModifier);
                                            nx = zRes.nx; ny = zRes.ny;
                                        }
                                    }
                                }
                            }

                            // --- LOCAL LAYER TRANSFORMATION & WARPING ---
                            if (isLayerWarpFirst) {
                                // 1. Local Warps First
                                if (hasLayerWarps) {
                                    for (let wIdx = 0; wIdx < activeLayerWarps.length; wIdx++) {
                                        let wModifier = activeLayerWarps[wIdx];
                                        let st = Number(wModifier.strength) / 100;
                                        let fq = Math.max(0.1, Number(wModifier.freq) || 4);
                                        let cdx = nx - 0.5, cdy = ny - 0.5;
                                        let cdist = Math.sqrt(cdx*cdx + cdy*cdy);

                                        if (wModifier.type === 'displacement') { 
                                            let mode = wModifier.dispMode || 'height_gradient';
                                            if (mode === 'vector_field') {
                                                let ox = Simplex.noise(nx * fq * 0.5 + 13.5, ny * fq * 0.5 + 27.1);
                                                let oy = Simplex.noise(nx * fq * 0.5 + 71.3, ny * fq * 0.5 + 83.9);
                                                let dispFactor = st * 0.2;
                                                nx += ox * dispFactor;
                                                ny += oy * dispFactor;
                                            } else if (mode === 'directional') {
                                                let h = (Simplex.noise(nx * fq * 0.5, ny * fq * 0.5) + 0.5 * Simplex.noise(nx * fq + 31.7, ny * fq + 53.1)) / 1.5;
                                                let ang = ((wModifier.angle || 0) * Math.PI) / 180;
                                                let dispFactor = h * st * 0.2;
                                                nx += Math.cos(ang) * dispFactor;
                                                ny += Math.sin(ang) * dispFactor;
                                            } else if (mode === 'radial') {
                                                let rcdx = nx - 0.5, rcdy = ny - 0.5;
                                                let rdist = Math.sqrt(rcdx * rcdx + rcdy * rcdy) || 0.001;
                                                let h = (Simplex.noise(nx * fq * 0.5, ny * fq * 0.5) + 0.5 * Simplex.noise(nx * fq + 31.7, ny * fq + 53.1)) / 1.5;
                                                let dispFactor = h * st * 0.2;
                                                nx += (rcdx / rdist) * dispFactor;
                                                ny += (rcdy / rdist) * dispFactor;
                                            } else {
                                                let eps = 0.001;
                                                let px = nx * fq * 0.5, py = ny * fq * 0.5;
                                                let h0 = Simplex.noise(px, py) + 0.5 * Simplex.noise(px * 2 + 13.7, py * 2 + 27.3);
                                                let hR = Simplex.noise(px + eps, py) + 0.5 * Simplex.noise((px + eps) * 2 + 13.7, py * 2 + 27.3);
                                                let hU = Simplex.noise(px, py + eps) + 0.5 * Simplex.noise(px * 2 + 13.7, (py + eps) * 2 + 27.3);
                                                let gradX = (hR - h0) / eps;
                                                let gradY = (hU - h0) / eps;
                                                let dispFactor = st * 0.02;
                                                nx += gradX * dispFactor;
                                                ny += gradY * dispFactor;
                                            }
                                        }
                                        else if (wModifier.type === 'vortex') { 
                                            let a = cdist * st * 15; 
                                            nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a); 
                                            ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a); 
                                        }
                                        else if (wModifier.type === 'twirl') { 
                                            let falloff = Math.max(0, 1 - (cdist / (fq * 0.25))); 
                                            let a = falloff * st * 10;
                                            nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a);
                                            ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a);
                                        }
                                        else if (wModifier.type === 'sine') { 
                                            const waveX = Math.sin(ny * fq * Math.PI) * st * 0.1;
                                            const waveY = Math.cos(nx * fq * Math.PI) * st * 0.1;
                                            nx += waveX; ny += waveY;
                                        }
                                        else if (wModifier.type === 'bulge') { 
                                            let power = Math.exp(-cdist * fq);
                                            let scale = 1 + power * st;
                                            nx = 0.5 + cdx * scale;
                                            ny = 0.5 + cdy * scale;
                                        }
                                        else if (wModifier.type === 'noise') { 
                                            let noX = NoiseCache.get(nx*fq, ny*fq) - 0.5; 
                                            let noY = NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5; 
                                            nx += noX * (st * 0.2); 
                                            ny += noY * (st * 0.2); 
                                        }
                                        else if (wModifier.type === 'domain_warp') {
                                            let offX = (NoiseCache.get(nx*fq, ny*fq) - 0.5) * st;
                                            let offY = (NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5) * st;
                                            nx += offX; ny += offY;
                                        }
                                        else if (wModifier.type === 'distortion') {
                                            nx += Math.sin(cdx * fq * Math.PI) * (st * 0.1);
                                            ny += Math.cos(cdy * fq * Math.PI) * (st * 0.1);
                                        }
                                        else if (wModifier.type === 'polar') {
                                            let r = cdist * fq;
                                            let theta = Math.atan2(cdy, cdx) / (Math.PI * 2);
                                            nx = 0.5 + r * Math.cos(theta * Math.PI * 2) * st;
                                            ny = 0.5 + r * Math.sin(theta * Math.PI * 2) * st;
                                        }
                                        else if (wModifier.type === 'point_deformer') {
                                            if (wModifier.points && wModifier.points.length > 0) {
                                                let pRes = CanvasDeformerManager.transformPointArray(nx * w, ny * h, wModifier.points, w, h);
                                                nx = pRes.x / w;
                                                ny = pRes.y / h;
                                            }
                                        }
                                        else if (wModifier.type === 'zoom_stretch') {
                                            let zRes = CanvasDeformerManager.applyZoomStretch(nx, ny, wModifier);
                                            nx = zRes.nx; ny = zRes.ny;
                                        }
                                    }
                                }
                                // 2. Local Layer Transform
                                if (hasLayerTransform) {
                                    nx -= 0.5; ny -= 0.5;
                                    nx /= lScale; ny /= lScale;
                                    if(p.angle) { 
                                        let rnx = nx * cosLRot - ny * sinLRot; 
                                        let rny = nx * sinLRot + ny * cosLRot; 
                                        nx = rnx; ny = rny;
                                    }
                                    if (p.perspectiveV || p.perspectiveH) {
                                        let pv = (p.perspectiveV || 0) / 200;
                                        let ph = (p.perspectiveH || 0) / 200;
                                        let pw = Math.max(0.1, 1 + nx * ph + ny * pv);
                                        nx /= pw;
                                        ny /= pw;
                                    }
                                    nx -= (p.offsetX || 0);
                                    ny -= (p.offsetY || 0);
                                    nx += 0.5; ny += 0.5;
                                }
                            } else {
                                // 1. Local Layer Transform First
                                if (hasLayerTransform) {
                                    nx -= 0.5; ny -= 0.5;
                                    nx /= lScale; ny /= lScale;
                                    if(p.angle) { 
                                        let rnx = nx * cosLRot - ny * sinLRot; 
                                        let rny = nx * sinLRot + ny * cosLRot; 
                                        nx = rnx; ny = rny;
                                    }
                                    if (p.perspectiveV || p.perspectiveH) {
                                        let pv = (p.perspectiveV || 0) / 200;
                                        let ph = (p.perspectiveH || 0) / 200;
                                        let pw = Math.max(0.1, 1 + nx * ph + ny * pv);
                                        nx /= pw;
                                        ny /= pw;
                                    }
                                    nx -= (p.offsetX || 0);
                                    ny -= (p.offsetY || 0);
                                    nx += 0.5; ny += 0.5;
                                }
                                // 2. Local Warps Second
                                if (hasLayerWarps) {
                                    for (let wIdx = 0; wIdx < activeLayerWarps.length; wIdx++) {
                                        let wModifier = activeLayerWarps[wIdx];
                                        let st = Number(wModifier.strength) / 100;
                                        let fq = Math.max(0.1, Number(wModifier.freq) || 4);
                                        let cdx = nx - 0.5, cdy = ny - 0.5;
                                        let cdist = Math.sqrt(cdx*cdx + cdy*cdy);

                                        if (wModifier.type === 'displacement') { 
                                            let mode = wModifier.dispMode || 'height_gradient';
                                            if (mode === 'vector_field') {
                                                let ox = Simplex.noise(nx * fq * 0.5 + 13.5, ny * fq * 0.5 + 27.1);
                                                let oy = Simplex.noise(nx * fq * 0.5 + 71.3, ny * fq * 0.5 + 83.9);
                                                let dispFactor = st * 0.2;
                                                nx += ox * dispFactor;
                                                ny += oy * dispFactor;
                                            } else if (mode === 'directional') {
                                                let h = (Simplex.noise(nx * fq * 0.5, ny * fq * 0.5) + 0.5 * Simplex.noise(nx * fq + 31.7, ny * fq + 53.1)) / 1.5;
                                                let ang = ((wModifier.angle || 0) * Math.PI) / 180;
                                                let dispFactor = h * st * 0.2;
                                                nx += Math.cos(ang) * dispFactor;
                                                ny += Math.sin(ang) * dispFactor;
                                            } else if (mode === 'radial') {
                                                let rcdx = nx - 0.5, rcdy = ny - 0.5;
                                                let rdist = Math.sqrt(rcdx * rcdx + rcdy * rcdy) || 0.001;
                                                let h = (Simplex.noise(nx * fq * 0.5, ny * fq * 0.5) + 0.5 * Simplex.noise(nx * fq + 31.7, ny * fq + 53.1)) / 1.5;
                                                let dispFactor = h * st * 0.2;
                                                nx += (rcdx / rdist) * dispFactor;
                                                ny += (rcdy / rdist) * dispFactor;
                                            } else {
                                                let eps = 0.001;
                                                let px = nx * fq * 0.5, py = ny * fq * 0.5;
                                                let h0 = Simplex.noise(px, py) + 0.5 * Simplex.noise(px * 2 + 13.7, py * 2 + 27.3);
                                                let hR = Simplex.noise(px + eps, py) + 0.5 * Simplex.noise((px + eps) * 2 + 13.7, py * 2 + 27.3);
                                                let hU = Simplex.noise(px, py + eps) + 0.5 * Simplex.noise(px * 2 + 13.7, (py + eps) * 2 + 27.3);
                                                let gradX = (hR - h0) / eps;
                                                let gradY = (hU - h0) / eps;
                                                let dispFactor = st * 0.02;
                                                nx += gradX * dispFactor;
                                                ny += gradY * dispFactor;
                                            }
                                        }
                                        else if (wModifier.type === 'vortex') { 
                                            let a = cdist * st * 15; 
                                            nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a); 
                                            ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a); 
                                        }
                                        else if (wModifier.type === 'twirl') { 
                                            let falloff = Math.max(0, 1 - (cdist / (fq * 0.25))); 
                                            let a = falloff * st * 10;
                                            nx = 0.5 + cdx*Math.cos(a) - cdy*Math.sin(a);
                                            ny = 0.5 + cdx*Math.sin(a) + cdy*Math.cos(a);
                                        }
                                        else if (wModifier.type === 'sine') { 
                                            const waveX = Math.sin(ny * fq * Math.PI) * st * 0.1;
                                            const waveY = Math.cos(nx * fq * Math.PI) * st * 0.1;
                                            nx += waveX; ny += waveY;
                                        }
                                        else if (wModifier.type === 'bulge') { 
                                            let power = Math.exp(-cdist * fq);
                                            let scale = 1 + power * st;
                                            nx = 0.5 + cdx * scale;
                                            ny = 0.5 + cdy * scale;
                                        }
                                        else if (wModifier.type === 'noise') { 
                                            let noX = NoiseCache.get(nx*fq, ny*fq) - 0.5; 
                                            let noY = NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5; 
                                            nx += noX * (st * 0.2); 
                                            ny += noY * (st * 0.2); 
                                        }
                                        else if (wModifier.type === 'domain_warp') {
                                            let offX = (NoiseCache.get(nx*fq, ny*fq) - 0.5) * st;
                                            let offY = (NoiseCache.get(nx*fq + 100, ny*fq + 100) - 0.5) * st;
                                            nx += offX; ny += offY;
                                        }
                                        else if (wModifier.type === 'distortion') {
                                            nx += Math.sin(cdx * fq * Math.PI) * (st * 0.1);
                                            ny += Math.cos(cdy * fq * Math.PI) * (st * 0.1);
                                        }
                                        else if (wModifier.type === 'polar') {
                                            let r = cdist * fq;
                                            let theta = Math.atan2(cdy, cdx) / (Math.PI * 2);
                                            nx = 0.5 + r * Math.cos(theta * Math.PI * 2) * st;
                                            ny = 0.5 + r * Math.sin(theta * Math.PI * 2) * st;
                                        }
                                        else if (wModifier.type === 'point_deformer') {
                                            if (wModifier.points && wModifier.points.length > 0) {
                                                let pRes = CanvasDeformerManager.transformPointArray(nx * w, ny * h, wModifier.points, w, h);
                                                nx = pRes.x / w;
                                                ny = pRes.y / h;
                                            }
                                        }
                                        else if (wModifier.type === 'zoom_stretch') {
                                            let zRes = CanvasDeformerManager.applyZoomStretch(nx, ny, wModifier);
                                            nx = zRes.nx; ny = zRes.ny;
                                        }
                                    }
                                }
                            }

                            let tx = nx + (p.seed||0)*0.013, ty = ny + (p.seed||0)*0.021;
                            let sx=p.scaleX||10, sy=p.scaleY||10;

                            if (lay.generatorType === 'paint') {
                                let pr = 0, pg = 0, pb = 0;
                                if (lay.paintBufferR) {
                                    let scaleFactorX = (sx || 10) / 10;
                                    let scaleFactorY = (sy || 10) / 10;
                                    let stx = (tx - 0.5) * scaleFactorX + 0.5;
                                    let sty = (ty - 0.5) * scaleFactorY + 0.5;
                                    let px = (stx % 1 + 1) % 1;
                                    let py = (sty % 1 + 1) % 1;
                                    let pw = 1024, ph = 1024;
                                    let x = px * (pw - 1), y = py * (ph - 1);
                                    let x0 = Math.floor(x), y0 = Math.floor(y);
                                    let x1 = Math.min(pw - 1, x0 + 1), y1 = Math.min(ph - 1, y0 + 1);
                                    let fx = x - x0, fy = y - y0;
                                    
                                    let r00 = lay.paintBufferR[y0 * pw + x0], r10 = lay.paintBufferR[y0 * pw + x1];
                                    let r01 = lay.paintBufferR[y1 * pw + x0], r11 = lay.paintBufferR[y1 * pw + x1];
                                    pr = (1 - fy) * ((1 - fx) * r00 + fx * r10) + fy * ((1 - fx) * r01 + fx * r11);

                                    let g00 = lay.paintBufferG[y0 * pw + x0], g10 = lay.paintBufferG[y0 * pw + x1];
                                    let g01 = lay.paintBufferG[y1 * pw + x0], g11 = lay.paintBufferG[y1 * pw + x1];
                                    pg = (1 - fy) * ((1 - fx) * g00 + fx * g10) + fy * ((1 - fx) * g01 + fx * g11);

                                    let b00 = lay.paintBufferB[y0 * pw + x0], b10 = lay.paintBufferB[y0 * pw + x1];
                                    let b01 = lay.paintBufferB[y1 * pw + x0], b11 = lay.paintBufferB[y1 * pw + x1];
                                    pb = (1 - fy) * ((1 - fx) * b00 + fx * b10) + fy * ((1 - fx) * b01 + fx * b11);
                                }
                                if(p.brightness!==undefined) { pr*=p.brightness; pg*=p.brightness; pb*=p.brightness; }
                                if(p.contrast!==undefined) { pr=(pr-0.5)*p.contrast+0.5; pg=(pg-0.5)*p.contrast+0.5; pb=(pb-0.5)*p.contrast+0.5; }
                                if(p.invert) { pr=1-pr; pg=1-pg; pb=1-pb; }
                                targetBufR[idx] = Math.max(0, Math.min(1, pr));
                                targetBufG[idx] = Math.max(0, Math.min(1, pg));
                                targetBufB[idx] = Math.max(0, Math.min(1, pb));
                            } else {
                                let v = 0;
                                if (p.seamless || gForceSeamless) {
                                    let tx0 = tx % 1.0; if (tx0 < 0) tx0 += 1.0;
                                    let ty0 = ty % 1.0; if (ty0 < 0) ty0 += 1.0;
                                    
                                    let softness = gForceSeamless ? Math.max(0, Math.min(1, gForceSoftness)) : Math.max(0, Math.min(1, p.seamlessSoftness ?? 1));
                                    let curveX = gBlendCurve === 'linear' ? tx0 : Perlin.fade(tx0);
                                    let curveY = gBlendCurve === 'linear' ? ty0 : Perlin.fade(ty0);
                                    let wx = Perlin.lerp(softness, tx0, curveX);
                                    let wy = Perlin.lerp(softness, ty0, curveY);

                                    let v00 = evalGenerator(lay.generatorType, tx0, ty0, sx, sy, p, activeCymaticsSources, lay);
                                    let totalV = v00 * (1 - wx) * (1 - wy);

                                    if (wx > 0.0005) {
                                        let v10 = evalGenerator(lay.generatorType, tx0 - 1, ty0, sx, sy, p, activeCymaticsSources, lay);
                                        totalV += v10 * wx * (1 - wy);
                                    }
                                    if (wy > 0.0005) {
                                        let v01 = evalGenerator(lay.generatorType, tx0, ty0 - 1, sx, sy, p, activeCymaticsSources, lay);
                                        totalV += v01 * (1 - wx) * wy;
                                    }
                                    if (wx > 0.0005 && wy > 0.0005) {
                                        let v11 = evalGenerator(lay.generatorType, tx0 - 1, ty0 - 1, sx, sy, p, activeCymaticsSources, lay);
                                        totalV += v11 * wx * wy;
                                    }
                                    v = totalV;
                                } else {
                                    v = evalGenerator(lay.generatorType, tx, ty, sx, sy, p, activeCymaticsSources, lay);
                                }

                                if(p.brightness!==undefined) v=v*p.brightness;
                                if(p.contrast!==undefined) v=(v-0.5)*p.contrast+0.5;
                                if(p.invert) v=1-v;

                                if (p.useLevels) {
                                    let min = (p.levelMin||0)/100, max = (p.levelMax||100)/100;
                                    if (max > min) v = (v - min) / (max - min);
                                }
                                if (p.useThreshold) v = v >= (p.thresholdVal||50)/100 ? 1 : 0;
                                
                                if (p.usePosterize) {
                                    let levels = Math.max(2, p.posterizeLevels || 4);
                                    v = Math.floor(v * levels) / (levels - 1);
                                }

                                v = Math.max(0, Math.min(1, v));
                                let lutIdx = (v * 255.99) | 0;
                                if (lutIdx < 0) lutIdx = 0; else if (lutIdx > 255) lutIdx = 255;

                                targetBufR[idx] = lutR[lutIdx];
                                targetBufG[idx] = lutG[lutIdx];
                                targetBufB[idx] = lutB[lutIdx];
                            }
                        }
                    }
                }

                if (useLayerCache) {
                    let sourceCacheR = lay[cacheRKey];
                    let sourceCacheG = lay[cacheGKey];
                    let sourceCacheB = lay[cacheBKey];
                    if (sourceCacheR && sourceCacheG && sourceCacheB) {
                        layerBufferR.set(sourceCacheR);
                        layerBufferG.set(sourceCacheG);
                        layerBufferB.set(sourceCacheB);
                    }
                }

                if (p.useFindEdges) {
                    applyEdgeDetection(layerBufferR, blurTempR, w, h);
                    applyEdgeDetection(layerBufferG, blurTempG, w, h);
                    applyEdgeDetection(layerBufferB, blurTempB, w, h);
                }
                if (p.blur > 0) {
                    let isTiled = (state.global.tileMode && state.global.tileMode !== 'off') || !!p.seamless;
                    let blurMode = isTiled ? 'wrap' : (p.blurClampEdge ? 'clamp' : 'wrap');
                    let bType = p.blurType || 'gaussian';
                    if (bType === 'box') {
                        applyBoxBlur(layerBufferR, blurTempR, w, h, parseInt(p.blur), blurMode);
                        applyBoxBlur(layerBufferG, blurTempG, w, h, parseInt(p.blur), blurMode);
                        applyBoxBlur(layerBufferB, blurTempB, w, h, parseInt(p.blur), blurMode);
                    } else {
                        applyGaussianBlur(layerBufferR, blurTempR, w, h, parseInt(p.blur), blurMode);
                        applyGaussianBlur(layerBufferG, blurTempG, w, h, parseInt(p.blur), blurMode);
                        applyGaussianBlur(layerBufferB, blurTempB, w, h, parseInt(p.blur), blurMode);
                    }
                }

                let useBlendIf = !!p.useBlendIf;
                let tb1 = (p.blendIfThisBlack1 !== undefined ? p.blendIfThisBlack1 : 0);
                let tb2 = (p.blendIfThisBlack2 !== undefined ? p.blendIfThisBlack2 : 0);
                let tw1 = (p.blendIfThisWhite1 !== undefined ? p.blendIfThisWhite1 : 100);
                let tw2 = (p.blendIfThisWhite2 !== undefined ? p.blendIfThisWhite2 : 100);

                let ub1 = (p.blendIfUnderBlack1 !== undefined ? p.blendIfUnderBlack1 : 0);
                let ub2 = (p.blendIfUnderBlack2 !== undefined ? p.blendIfUnderBlack2 : 0);
                let uw1 = (p.blendIfUnderWhite1 !== undefined ? p.blendIfUnderWhite1 : 100);
                let uw2 = (p.blendIfUnderWhite2 !== undefined ? p.blendIfUnderWhite2 : 100);

                if (useBlendIf && tb1 <= 0 && tb2 <= 0 && tw1 >= 100 && tw2 >= 100 && ub1 <= 0 && ub2 <= 0 && uw1 >= 100 && uw2 >= 100) {
                    useBlendIf = false;
                }

                let bIfChan = p.blendIfChannel || 'gray';
                let invTb = (tb2 > tb1) ? 1.0 / (tb2 - tb1) : 0;
                let invTw = (tw2 > tw1) ? 1.0 / (tw2 - tw1) : 0;
                let invUb = (ub2 > ub1) ? 1.0 / (ub2 - ub1) : 0;
                let invUw = (uw2 > uw1) ? 1.0 / (uw2 - uw1) : 0;

                const getBIfVal = (r, g, b, chan) => {
                    if (chan === 'red') return r * 100;
                    if (chan === 'green') return g * 100;
                    if (chan === 'blue') return b * 100;
                    return (0.299 * r + 0.587 * g + 0.114 * b) * 100;
                };

                const calcBIfRampAlpha = (val, b1, b2, w1, w2) => {
                    let a = 1.0;
                    if (val < b1) a = 0;
                    else if (val < b2) a = (b2 > b1) ? (val - b1) / (b2 - b1) : 1;
                    else if (val > w2) a = 0;
                    else if (val > w1) a = (w2 > w1) ? 1 - (val - w1) / (w2 - w1) : 1;
                    return a < 0 ? 0 : (a > 1 ? 1 : a);
                };

                if (lay.isMask) {
                    if (pendingRemaining > 0) {
                        for (let i=0;i<w*h;i++) {
                            let maskLum = 0.299 * layerBufferR[i] + 0.587 * layerBufferG[i] + 0.114 * layerBufferB[i];
                            let bifA = 1.0;
                            if (useBlendIf) {
                                let sVal = getBIfVal(layerBufferR[i], layerBufferG[i], layerBufferB[i], bIfChan);
                                let uVal = getBIfVal(pendingMaskTargetR[i], pendingMaskTargetG[i], pendingMaskTargetB[i], bIfChan);
                                bifA = calcBIfRampAlpha(sVal, tb1, tb2, tw1, tw2) * calcBIfRampAlpha(uVal, ub1, ub2, uw1, uw2);
                            }
                            pendingMaskAlphaBuffer[i] *= maskLum * bifA;
                        }
                        pendingRemaining--;
                        if (pendingRemaining === 0) {
                            if (firstBlend) {
                                for(let i=0;i<w*h;i++) {
                                    let a = pendingMaskAlphaBuffer[i];
                                    blendBufferR[i] = pendingMaskTargetR[i]*a;
                                    blendBufferG[i] = pendingMaskTargetG[i]*a;
                                    blendBufferB[i] = pendingMaskTargetB[i]*a;
                                }
                            } else {
                                if (pendingBlendFn.isColorMode) {
                                    for(let i=0;i<w*h;i++) {
                                        let a = pendingMaskAlphaBuffer[i]*pendingOp;
                                        let res = pendingBlendFn(blendBufferR[i], blendBufferG[i], blendBufferB[i], pendingMaskTargetR[i], pendingMaskTargetG[i], pendingMaskTargetB[i]);
                                        blendBufferR[i] = blendBufferR[i]*(1-a) + res[0]*a;
                                        blendBufferG[i] = blendBufferG[i]*(1-a) + res[1]*a;
                                        blendBufferB[i] = blendBufferB[i]*(1-a) + res[2]*a;
                                    }
                                } else {
                                    for(let i=0;i<w*h;i++) {
                                        let a = pendingMaskAlphaBuffer[i]*pendingOp;
                                        blendBufferR[i] = blendBufferR[i]*(1-a) + pendingBlendFn(blendBufferR[i],pendingMaskTargetR[i])*a;
                                        blendBufferG[i] = blendBufferG[i]*(1-a) + pendingBlendFn(blendBufferG[i],pendingMaskTargetG[i])*a;
                                        blendBufferB[i] = blendBufferB[i]*(1-a) + pendingBlendFn(blendBufferB[i],pendingMaskTargetB[i])*a;
                                    }
                                }
                            }
                            firstBlend = false;
                        }
                    }
                } else if (clippedByMasks[lIdx]) {
                    pendingMaskTargetR.set(layerBufferR);
                    pendingMaskTargetG.set(layerBufferG);
                    pendingMaskTargetB.set(layerBufferB);
                    if (useBlendIf) {
                        for (let i=0; i<w*h; i++) {
                            let sVal = getBIfVal(layerBufferR[i], layerBufferG[i], layerBufferB[i], bIfChan);
                            let uVal = getBIfVal(blendBufferR[i], blendBufferG[i], blendBufferB[i], bIfChan);
                            pendingMaskAlphaBuffer[i] = calcBIfRampAlpha(sVal, tb1, tb2, tw1, tw2) * calcBIfRampAlpha(uVal, ub1, ub2, uw1, uw2);
                        }
                    } else {
                        pendingMaskAlphaBuffer.fill(1);
                    }
                    pendingOp = op; pendingBlendFn = bFn;
                    pendingRemaining = clippedByMasks[lIdx].length;
                } else {
                    if (firstBlend) {
                        if (useBlendIf) {
                            for(let i=0; i<w*h; i++) {
                                let sr = layerBufferR[i], sg = layerBufferG[i], sb = layerBufferB[i];
                                let sVal = (bIfChan === 'red') ? sr * 100 : ((bIfChan === 'green') ? sg * 100 : ((bIfChan === 'blue') ? sb * 100 : (0.299 * sr + 0.587 * sg + 0.114 * sb) * 100));
                                let sA = 1.0;
                                if (sVal < tb1) sA = 0;
                                else if (sVal < tb2) sA = (sVal - tb1) * invTb;
                                else if (sVal > tw2) sA = 0;
                                else if (sVal > tw1) sA = 1.0 - (sVal - tw1) * invTw;

                                let bifA = sA;
                                blendBufferR[i] = sr * bifA;
                                blendBufferG[i] = sg * bifA;
                                blendBufferB[i] = sb * bifA;
                            }
                        } else {
                            blendBufferR.set(layerBufferR);
                            blendBufferG.set(layerBufferG);
                            blendBufferB.set(layerBufferB);
                        }
                        firstBlend = false;
                    } else if (op === 1.0 && bFn === Blend.normal && !useBlendIf) {
                        blendBufferR.set(layerBufferR);
                        blendBufferG.set(layerBufferG);
                        blendBufferB.set(layerBufferB);
                    } else {
                        let totalPix = w * h;
                        if (useBlendIf) {
                            for(let i=0; i<totalPix; i++) {
                                let sr = layerBufferR[i], sg = layerBufferG[i], sb = layerBufferB[i];
                                let sVal = (bIfChan === 'red') ? sr * 100 : ((bIfChan === 'green') ? sg * 100 : ((bIfChan === 'blue') ? sb * 100 : (0.299 * sr + 0.587 * sg + 0.114 * sb) * 100));
                                let sA = 1.0;
                                if (sVal < tb1) sA = 0;
                                else if (sVal < tb2) sA = (sVal - tb1) * invTb;
                                else if (sVal > tw2) sA = 0;
                                else if (sVal > tw1) sA = 1.0 - (sVal - tw1) * invTw;

                                if (sA <= 0) continue;

                                let br = blendBufferR[i], bg = blendBufferG[i], bb = blendBufferB[i];
                                let uVal = (bIfChan === 'red') ? br * 100 : ((bIfChan === 'green') ? bg * 100 : ((bIfChan === 'blue') ? bb * 100 : (0.299 * br + 0.587 * bg + 0.114 * bb) * 100));
                                let uA = 1.0;
                                if (uVal < ub1) uA = 0;
                                else if (uVal < ub2) uA = (uVal - ub1) * invUb;
                                else if (uVal > uw2) uA = 0;
                                else if (uVal > uw1) uA = 1.0 - (uVal - uw1) * invUw;

                                let bifA = sA * uA;
                                if (bifA <= 0) continue;

                                let effOp = op * bifA;
                                if (effOp >= 1.0 && bFn === Blend.normal) {
                                    blendBufferR[i] = sr; blendBufferG[i] = sg; blendBufferB[i] = sb;
                                } else if (bFn === Blend.normal) {
                                    blendBufferR[i] = br * (1 - effOp) + sr * effOp;
                                    blendBufferG[i] = bg * (1 - effOp) + sg * effOp;
                                    blendBufferB[i] = bb * (1 - effOp) + sb * effOp;
                                } else if (bFn === Blend.multiply) {
                                    blendBufferR[i] = br * (1 - effOp) + (br * sr) * effOp;
                                    blendBufferG[i] = bg * (1 - effOp) + (bg * sg) * effOp;
                                    blendBufferB[i] = bb * (1 - effOp) + (bb * sb) * effOp;
                                } else if (bFn === Blend.screen) {
                                    blendBufferR[i] = br * (1 - effOp) + (1 - (1 - br) * (1 - sr)) * effOp;
                                    blendBufferG[i] = bg * (1 - effOp) + (1 - (1 - bg) * (1 - sg)) * effOp;
                                    blendBufferB[i] = bb * (1 - effOp) + (1 - (1 - bb) * (1 - sb)) * effOp;
                                } else if (bFn === Blend.overlay) {
                                    let ovR = br < 0.5 ? 2 * br * sr : 1 - 2 * (1 - br) * (1 - sr);
                                    let ovG = bg < 0.5 ? 2 * bg * sg : 1 - 2 * (1 - bg) * (1 - sg);
                                    let ovB = bb < 0.5 ? 2 * bb * sb : 1 - 2 * (1 - bb) * (1 - sb);
                                    blendBufferR[i] = br * (1 - effOp) + ovR * effOp;
                                    blendBufferG[i] = bg * (1 - effOp) + ovG * effOp;
                                    blendBufferB[i] = bb * (1 - effOp) + ovB * effOp;
                                } else if (bFn === Blend.add || bFn === Blend.lineardodge) {
                                    blendBufferR[i] = br * (1 - effOp) + Math.min(1, br + sr) * effOp;
                                    blendBufferG[i] = bg * (1 - effOp) + Math.min(1, bg + sg) * effOp;
                                    blendBufferB[i] = bb * (1 - effOp) + Math.min(1, bb + sb) * effOp;
                                } else if (bFn.isColorMode) {
                                    let res = bFn(br, bg, bb, sr, sg, sb);
                                    blendBufferR[i] = br * (1 - effOp) + res[0] * effOp;
                                    blendBufferG[i] = bg * (1 - effOp) + res[1] * effOp;
                                    blendBufferB[i] = bb * (1 - effOp) + res[2] * effOp;
                                } else {
                                    blendBufferR[i] = br * (1 - effOp) + bFn(br, sr) * effOp;
                                    blendBufferG[i] = bg * (1 - effOp) + bFn(bg, sg) * effOp;
                                    blendBufferB[i] = bb * (1 - effOp) + bFn(bb, sb) * effOp;
                                }
                            }
                        } else {
                            let oneMinusOp = 1 - op;
                            if (bFn === Blend.normal) {
                                for(let i=0; i<totalPix; i++) {
                                    blendBufferR[i] = blendBufferR[i] * oneMinusOp + layerBufferR[i] * op;
                                    blendBufferG[i] = blendBufferG[i] * oneMinusOp + layerBufferG[i] * op;
                                    blendBufferB[i] = blendBufferB[i] * oneMinusOp + layerBufferB[i] * op;
                                }
                            } else if (bFn === Blend.multiply) {
                                for(let i=0; i<totalPix; i++) {
                                    blendBufferR[i] = blendBufferR[i] * oneMinusOp + (blendBufferR[i] * layerBufferR[i]) * op;
                                    blendBufferG[i] = blendBufferG[i] * oneMinusOp + (blendBufferG[i] * layerBufferG[i]) * op;
                                    blendBufferB[i] = blendBufferB[i] * oneMinusOp + (blendBufferB[i] * layerBufferB[i]) * op;
                                }
                            } else if (bFn === Blend.screen) {
                                for(let i=0; i<totalPix; i++) {
                                    blendBufferR[i] = blendBufferR[i] * oneMinusOp + (1 - (1 - blendBufferR[i]) * (1 - layerBufferR[i])) * op;
                                    blendBufferG[i] = blendBufferG[i] * oneMinusOp + (1 - (1 - blendBufferG[i]) * (1 - layerBufferG[i])) * op;
                                    blendBufferB[i] = blendBufferB[i] * oneMinusOp + (1 - (1 - blendBufferB[i]) * (1 - layerBufferB[i])) * op;
                                }
                            } else if (bFn.isColorMode) {
                                for(let i=0; i<totalPix; i++) {
                                    let res = bFn(blendBufferR[i], blendBufferG[i], blendBufferB[i], layerBufferR[i], layerBufferG[i], layerBufferB[i]);
                                    blendBufferR[i] = blendBufferR[i] * oneMinusOp + res[0] * op;
                                    blendBufferG[i] = blendBufferG[i] * oneMinusOp + res[1] * op;
                                    blendBufferB[i] = blendBufferB[i] * oneMinusOp + res[2] * op;
                                }
                            } else {
                                for(let i=0; i<totalPix; i++) {
                                    blendBufferR[i] = blendBufferR[i] * oneMinusOp + bFn(blendBufferR[i], layerBufferR[i]) * op;
                                    blendBufferG[i] = blendBufferG[i] * oneMinusOp + bFn(blendBufferG[i], layerBufferG[i]) * op;
                                    blendBufferB[i] = blendBufferB[i] * oneMinusOp + bFn(blendBufferB[i], layerBufferB[i]) * op;
                                }
                            }
                        }
                    }
                }
            }

            if(state.global.blur>0) {
                let isGlobalTiled = (state.global.tileMode && state.global.tileMode !== 'off');
                let globalBlurMode = isGlobalTiled ? 'wrap' : (state.global.blurClampEdge ? 'clamp' : 'wrap');
                let gBType = state.global.blurType || 'gaussian';
                if (gBType === 'box') {
                    applyBoxBlur(blendBufferR, blurTempR, w, h, parseInt(state.global.blur), globalBlurMode);
                    applyBoxBlur(blendBufferG, blurTempG, w, h, parseInt(state.global.blur), globalBlurMode);
                    applyBoxBlur(blendBufferB, blurTempB, w, h, parseInt(state.global.blur), globalBlurMode);
                } else {
                    applyGaussianBlur(blendBufferR, blurTempR, w, h, parseInt(state.global.blur), globalBlurMode);
                    applyGaussianBlur(blendBufferG, blurTempG, w, h, parseInt(state.global.blur), globalBlurMode);
                    applyGaussianBlur(blendBufferB, blurTempB, w, h, parseInt(state.global.blur), globalBlurMode);
                }
            }

            let gg=state.global.gamma||1, gc=state.global.contrast||1, gr=state.global.grain||0, gi=state.global.invert===true;
            let g = state.global;

            let gHue = g.globalHueShift || 0;
            let gSat = g.globalSaturation !== undefined ? g.globalSaturation : 100;
            let gVib = g.globalVibrance || 0;
            let gTemp = g.globalColorTemp || 0;
            let gTint = g.globalColorTint || 0;
            let gOverlayColor = hexToRgbNormalized(g.globalColorOverlay || '#000000');
            let gOverlayOp = (g.globalColorOverlayOpacity || 0) / 100;

            let vAmt = g.vignetteAmount !== undefined ? g.vignetteAmount : (g.vignette ? -Math.round(g.vignette * 100) : 0);
            let vMid = (g.vignetteMidpoint !== undefined ? g.vignetteMidpoint : 50) / 100;
            let vFeath = Math.max(0.01, (g.vignetteFeather !== undefined ? g.vignetteFeather : 50) / 100);
            let vRound = (g.vignetteRoundness !== undefined ? g.vignetteRoundness : 0) / 100;
            let vHigh = (g.vignetteHighlights !== undefined ? g.vignetteHighlights : 0) / 100;
            let vCX = g.vignetteCenterX !== undefined ? g.vignetteCenterX : 0.5;
            let vCY = g.vignetteCenterY !== undefined ? g.vignetteCenterY : 0.5;

            let hasVignette = (vAmt !== 0);
            let aspect = w / h;

            let amtNorm = vAmt / 100; 
            let vWidth = Math.max(0.05, vFeath * 1.2);
            let vMinT = vMid * 1.2 - vWidth / 2;
            let invVWidth = 1.0 / vWidth;

            for(let y=0; y<h; y++){
                let ny = y / h - vCY;
                for(let x=0; x<w; x++){
                    let px_idx = y*w+x;
                    let vr = blendBufferR[px_idx];
                    let vg = blendBufferG[px_idx];
                    let vb = blendBufferB[px_idx];

                    if(gi) { vr = 1 - vr; vg = 1 - vg; vb = 1 - vb; }
                    if(gc!==1) {
                        vr = (vr - 0.5) * gc + 0.5;
                        vg = (vg - 0.5) * gc + 0.5;
                        vb = (vb - 0.5) * gc + 0.5;
                    }
                    if(gg!==1) {
                        if (vr > 0) vr = Math.pow(vr, 1 / gg);
                        if (vg > 0) vg = Math.pow(vg, 1 / gg);
                        if (vb > 0) vb = Math.pow(vb, 1 / gg);
                    }

                    if (gTemp !== 0) {
                        let tFactor = gTemp / 100;
                        vr += tFactor * 0.1;
                        vb -= tFactor * 0.1;
                    }
                    if (gTint !== 0) {
                        let tFactor = gTint / 100;
                        vg += tFactor * 0.1;
                    }

                    if (gHue !== 0 || gSat !== 100 || gVib !== 0) {
                        let adj = applyRgbColorAdjustments([vr, vg, vb], gHue, gSat, gVib);
                        vr = adj[0]; vg = adj[1]; vb = adj[2];
                    }

                    if (gOverlayOp > 0) {
                        vr = vr * (1 - gOverlayOp) + gOverlayColor[0] * gOverlayOp;
                        vg = vg * (1 - gOverlayOp) + gOverlayColor[1] * gOverlayOp;
                        vb = vb * (1 - gOverlayOp) + gOverlayColor[2] * gOverlayOp;
                    }

                    if (hasVignette) {
                        let nx = x / w - vCX;
                        let dEllipse = 2.0 * Math.sqrt(nx * nx + ny * ny);
                        let d;
                        if (vRound > 0) {
                            let dCircle = 2.0 * Math.sqrt(nx * nx + (ny * aspect) * (ny * aspect));
                            d = dEllipse * (1.0 - vRound) + dCircle * vRound;
                        } else if (vRound < 0) {
                            let dBox = 2.0 * Math.max(Math.abs(nx), Math.abs(ny));
                            let rAbs = -vRound;
                            d = dEllipse * (1.0 - rAbs) + dBox * rAbs;
                        } else {
                            d = dEllipse;
                        }

                        let t = (d - vMinT) * invVWidth;
                        if (t > 1.0) t = 1.0;
                        else if (t < 0.0) t = 0.0;
                        let falloff = t * t * (3.0 - 2.0 * t);

                        let factor;
                        if (amtNorm < 0) {
                            let darken = -amtNorm * falloff;
                            if (vHigh > 0) {
                                let lum = 0.299 * vr + 0.587 * vg + 0.114 * vb;
                                darken *= (1.0 - vHigh * Math.min(1, Math.max(0, lum)) ** 2);
                            }
                            factor = 1.0 - darken;
                        } else {
                            let brighten = amtNorm * falloff;
                            factor = 1.0 + brighten;
                        }
                        let vf = Math.max(0, factor);
                        vr *= vf; vg *= vf; vb *= vf;
                    }

                    if(gr>0) {
                        let gVal = (pseudoNoise(px_idx, 999) - 0.5) * (gr / 255);
                        vr += gVal; vg += gVal; vb += gVal;
                    }

                    let px = px_idx * 4;
                    data[px] = Math.max(0, Math.min(255, Math.floor(vr * 255)));
                    data[px + 1] = Math.max(0, Math.min(255, Math.floor(vg * 255)));
                    data[px + 2] = Math.max(0, Math.min(255, Math.floor(vb * 255)));
                    data[px + 3] = 255;
                }
            }

            if (isDraft) {
                if (!window.draftCanvas256) {
                    window.draftCanvas256 = document.createElement('canvas');
                    window.draftCanvas256.width = 256;
                    window.draftCanvas256.height = 256;
                }
                let dCtx = window.draftCanvas256.getContext('2d');
                dCtx.putImageData(imgData, 0, 0);

                cx.imageSmoothingEnabled = true;
                cx.drawImage(window.draftCanvas256, 0, 0, fullW, fullH);
            } else {
                cx.putImageData(imgData, 0, 0);
            }

            let shouldProcessTiling = tilingState.enabled || (typeof currentTab !== 'undefined' && currentTab === 'tiling');
            if (shouldProcessTiling) {
                if (!tilingState.customImageLoaded) {
                    if (!tilingOriginalCanvas) {
                        tilingOriginalCanvas = document.createElement('canvas');
                    }
                    if (tilingOriginalCanvas.width !== w || tilingOriginalCanvas.height !== h) {
                        tilingOriginalCanvas.width = w;
                        tilingOriginalCanvas.height = h;
                    }
                    let octx = tilingOriginalCanvas.getContext('2d');
                    octx.drawImage(cv, 0, 0);
                    tilingState.hasImage = true;
                }

                runTilingPipeline(true);

                if (tilingState.enabled) {
                    if (isExport || cv !== canvas) {
                        if (tilingProcessedCanvas) {
                            cx.clearRect(0, 0, w, h);
                            cx.drawImage(tilingProcessedCanvas, 0, 0, w, h);
                        }
                    } else if (currentTab === 'tiling') {
                        renderTilingView();
                    } else if (tilingProcessedCanvas) {
                        cx.clearRect(0, 0, w, h);
                        cx.drawImage(tilingProcessedCanvas, 0, 0, w, h);
                    }
                } else if (currentTab === 'tiling' && !isExport && cv === canvas) {
                    renderTilingView();
                }
            }
            if(!isExport && window.mapGeneratorTab && typeof window.mapGeneratorTab.onCanvasUpdated === 'function') {
                window.mapGeneratorTab.onCanvasUpdated();
            }
            if(!isExport) drawPointDeformerOverlays(cx, w, h);
            let totalRenderTimeMs = performance.now() - start;
            if(!isExport && $('renderTime')) $('renderTime').textContent = `${totalRenderTimeMs.toFixed(1)} ms`;
            if (window.globalProfiler) {
                window.globalProfiler.recordFrame(totalRenderTimeMs);
                if (!isExport && $('fpsInfo')) {
                    let snap = window.globalProfiler.getSnapshot();
                    $('fpsInfo').textContent = `${snap.fps} FPS`;
                }
            }
        }

        function renderStickyHeader() {
            let headerEl = $('stickyLayerHeader');
            if (!headerEl) return;

            if (currentTab !== 'layer') {
                headerEl.classList.add('hidden');
                headerEl.dataset.layerId = '';
                return;
            }

            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay) {
                headerEl.classList.add('hidden');
                headerEl.dataset.layerId = '';
                return;
            }

            headerEl.classList.remove('hidden');

            let layerIdx = state.layers.findIndex(l => l.id === lay.id);

            if (headerEl.dataset.layerId === lay.id && headerEl.querySelector('#sticky_lay_name')) {
                let nameInp = headerEl.querySelector('#sticky_lay_name');
                if (nameInp && document.activeElement !== nameInp) nameInp.value = lay.name;

                let blendSel = headerEl.querySelector('#sticky_lay_blend');
                if (blendSel && document.activeElement !== blendSel) blendSel.value = lay.blendMode;

                let rngOpacity = $('rng_lay_opacity');
                if (rngOpacity && document.activeElement !== rngOpacity) rngOpacity.value = lay.opacity;

                let numOpacity = $('num_lay_opacity');
                if (numOpacity && document.activeElement !== numOpacity) numOpacity.value = lay.opacity;

                let btnReset = headerEl.querySelector('#sticky_lay_reset');
                if (btnReset) btnReset.setAttribute('onclick', `resetLayer(${layerIdx})`);

                return;
            }

            headerEl.dataset.layerId = lay.id;

            headerEl.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:8px; margin-bottom:8px;">
                    <div style="flex:1;">
                        <label class="property-label" style="font-size:10px; margin-bottom:2px;">${t('lbl_layer_name')}</label>
                        <input type="text" id="sticky_lay_name" value="${lay.name}" onchange="lay.name=this.value;renderLayers();renderStickyHeader();" class="form-control" style="height:30px; font-size:12px;">
                    </div>
                    <button id="sticky_lay_reset" onclick="resetLayer(${layerIdx})" class="btn btn-secondary" style="height:30px; padding:0 8px; font-size:11px; white-space:nowrap; flex-shrink:0;" title="${t('btn_reset_layer')}">${t('btn_reset_layer')}</button>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; align-items:end;">
                    <div>
                        <label class="property-label" style="font-size:10px; margin-bottom:2px;">${t('blend_mode_label')}</label>
                        <select id="sticky_lay_blend" onchange="upd('blendMode',this.value,false)" class="form-control" style="height:30px; font-size:11px; width:100%;">
                            ${BLEND_MODE_GROUPS.map(g => `<optgroup label="${g.label}">${g.modes.map(o => `<option value="${o.id}" ${lay.blendMode === o.id ? 'selected' : ''}>${o.name}</option>`).join('')}</optgroup>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="property-label" style="font-size:10px; margin-bottom:2px;">${t('opacity_label')}</label>
                        <div style="display:flex; gap:4px; align-items:center;">
                            <input type="range" id="rng_lay_opacity" min="0" max="100" step="1" value="${lay.opacity}" data-no-random oninput="$('num_lay_opacity').value=this.value; upd('opacity',this.value,false)" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,100)" style="height:4px; flex:1;">
                            <input type="number" class="num-input" id="num_lay_opacity" step="1" value="${lay.opacity}" oninput="$('rng_lay_opacity').value=this.value; upd('opacity',this.value,false)" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,100)" style="width:48px; padding:2px; font-size:11px; flex-shrink:0;">
                        </div>
                    </div>
                </div>
            `;
        }

        function switchRightTab(tab) {
            currentTab = tab;
            if ($('btnTabLayer')) $('btnTabLayer').className = tab==='layer'?'btn btn-primary':'btn btn-secondary';
            if ($('btnTabGlobal')) $('btnTabGlobal').className = tab==='global'?'btn btn-primary':'btn btn-secondary';
            if ($('btnTabTiling')) $('btnTabTiling').className = tab==='tiling'?'btn btn-primary':'btn btn-secondary';
            if ($('btnTabMaps')) $('btnTabMaps').className = tab==='maps'?'btn btn-primary':'btn btn-secondary';

            renderStickyHeader();

            const mapContainer = $('mapGenViewportContainer');
            if (tab === 'maps') {
                window.isPbrModeActive = true;
                if (mapContainer) mapContainer.style.display = 'flex';
                if (window.mapGeneratorTab) {
                    window.mapGeneratorTab.renderRightPanelControls();
                    window.mapGeneratorTab.renderUnifiedViewportContainer();
                    window.mapGeneratorTab.syncManager.pullCanvasData();
                }
                return;
            } else {
                if (!window.isPbrModeActive && mapContainer) mapContainer.style.display = 'none';
            }

            if (tab === 'tiling') {
                $('rightPanelTitle').innerText = t('title_tiling_props');
                renderTilingPanel();
                requestRender();
            } else {
                $('rightPanelTitle').innerText = tab==='layer'? t('title_layer_props') : t('title_global_props');
                if (tilingState.stamp_enable) {
                    toggleTilingStamp(false);
                }
                tab==='layer'?renderProps():renderGlobal();
                requestRender();
            }
        }

        window.selectLayerCard = function(layerId) {
            state.selectedLayerId = layerId;
            renderLayers();
            if (currentTab === 'layer') {
                renderProps();
            } else if (currentTab === 'global') {
                renderGlobal();
            } else if (currentTab === 'maps') {
                if (window.mapGeneratorTab && window.mapGeneratorTab.syncManager.sourceType === 'active_layer') {
                    window.mapGeneratorTab.syncManager.pullCanvasData();
                }
            } else if (currentTab === 'tiling') {
                renderTilingPanel();
            }
        };

        let pointerLayerDragState = null;

        window.handleLayerPointerDown = function(e, idx) {
            if (e.button !== undefined && e.button !== 0) return;
            e.stopPropagation();
            let handle = e.currentTarget;
            let card = handle.closest('.layer-card');
            if (!card) return;

            pointerLayerDragState = {
                fromIdx: idx,
                cardEl: card
            };

            try { handle.setPointerCapture(e.pointerId); } catch(err) {}
            card.classList.add('dragging');

            handle.onpointermove = function(ev) {
                if (!pointerLayerDragState) return;
                let targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
                let targetCard = targetEl ? targetEl.closest('.layer-card') : null;
                document.querySelectorAll('.layer-card').forEach(c => c.classList.remove('drag-over'));
                if (targetCard && targetCard !== pointerLayerDragState.cardEl) {
                    targetCard.classList.add('drag-over');
                }
            };

            handle.onpointerup = handle.onpointercancel = function(ev) {
                if (!pointerLayerDragState) return;
                let targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
                let targetCard = targetEl ? targetEl.closest('.layer-card') : null;
                if (targetCard && targetCard.dataset.layerIndex !== undefined) {
                    let targetIdx = parseInt(targetCard.dataset.layerIndex, 10);
                    if (!isNaN(targetIdx) && targetIdx !== pointerLayerDragState.fromIdx) {
                        let [movedLayer] = state.layers.splice(pointerLayerDragState.fromIdx, 1);
                        state.layers.splice(targetIdx, 0, movedLayer);
                        commitHistorySnapshot();
                        renderLayers();
                        requestRender();
                    }
                }
                document.querySelectorAll('.layer-card').forEach(c => c.classList.remove('dragging', 'drag-over'));
                try { handle.releasePointerCapture(ev.pointerId); } catch(err) {}
                handle.onpointermove = null;
                handle.onpointerup = null;
                handle.onpointercancel = null;
                pointerLayerDragState = null;
            };
        };

        function renderLayers() {
            let { maskTargetIndex, clippedByMasks } = computeMaskRelationships();
            $('layersList').innerHTML = state.layers.map((l,i) => {
                let isMasked = !!clippedByMasks[i];
                let maskHasNoTarget = l.isMask && maskTargetIndex[i] === -1;
                return `
                <div class="layer-card ${l.id===state.selectedLayerId?'active':''} ${l.isMask?'is-mask':''} ${maskHasNoTarget?'is-mask-empty':''} ${isMasked?'is-masked-target':''} ${!l.visible?'is-hidden':''}" 
                     data-layer-id="${l.id}" 
                     data-layer-index="${i}" 
                     onclick="selectLayerCard('${l.id}')">
                    <div class="layer-row-top">
                        <div class="layer-info">
                            <span class="drag-handle" title="${t('drag_layer_tooltip')}" onpointerdown="handleLayerPointerDown(event, ${i})" onclick="event.stopPropagation()">⣿</span>
                            ${isMasked?`<span class="mask-link-icon" title="${t('mask_target_tooltip')}">⤷</span>`:''}
                            <button onclick="event.stopPropagation(); toggleLayerVisibility(${i})" class="layer-btn ${l.visible?'layer-visible':'layer-hidden'}" title="${l.visible?t('hide_layer_tooltip'):t('show_layer_tooltip')}" style="padding:0; margin-right:4px;">${l.visible?'👁':'🕶'}</button>
                            <span class="layer-name">${l.name}</span>
                            ${l.isMask?`<span class="mask-badge" title="${maskHasNoTarget?t('mask_no_target_tooltip'):t('mask_target_tooltip')}">${t('mask_badge')}</span>`:''}
                        </div>
                        <div class="layer-controls">
                            <button onclick="event.stopPropagation(); toggleMask(${i})" class="layer-btn ${l.isMask?'layer-btn-mask-active':''}" title="${t('use_as_mask_tooltip')}">🎭</button>
                            <button onclick="event.stopPropagation(); duplicateLayer(${i})" class="layer-btn" title="${t('duplicate_layer_tooltip')}">📋</button>
                            <button onclick="event.stopPropagation(); deleteLayer(${i})" class="layer-btn layer-btn-delete" title="${t('delete_layer_tooltip')}">✕</button>
                        </div>
                    </div>
                    <div class="layer-meta"><span>${l.generatorType.toUpperCase()}</span><span>${l.blendMode.toUpperCase()} | ${l.opacity}%</span></div>
                </div>`;
            }).join('');
        }

        function toggleLayerVisibility(i) {
            let lay = state.layers[i];
            if (!lay) return;
            lay.visible = !lay.visible;
            lay.isDirty = true;
            renderLayers();
            renderProps();
            requestRender();
            commitHistorySnapshot();
        }

        // Базові (спільні для всіх типів генератора) параметри нового/скинутого шару.
        // Параметри, специфічні для конкретного алгоритму (frequency, radialCount,
        // metric, octaves...), свідомо ВІДСУТНІ тут — вони підхоплюють власні
        // значення за замовчуванням через || / ?? у renderProps()/evalGenerator()
        // самі, щойно з'являються на екрані для свого типу генератора.
        function freshLayerParams() {
            return { seamless:false, scale:10, scaleX:10, scaleY:10, lockScale:true, layerScale:1, contrast:1, brightness:1, angle:0, perspectiveV:0, perspectiveH:0, blur:0, blurType:'gaussian', blurClampEdge:false,
                dotSize: 0.25, dotSoftness: 0.05, dotGrid: 'square', dotShape: 'circle',
                pixelGap: 0.0, pixelGapValue: 0.0, pixelGapSoftness: 0.0,
                pixelGridType: 'standard', pixelShape: 'square', pixelCornerRadius: 0.1,
                pixelDistribution: 'uniform', pixelThreshold: 0.5, pixelSteps: 4,
                pixelBevel: 0.0, pixelBevelType: 'pyramid', pixelSeed: 0,
                offsetX:0, offsetY:0, invert:false, warps:[], warpOrder: 'transform_first',
                useThreshold:false, thresholdVal:50, useLevels:false, levelMin:0, levelMax:100,
                usePosterize:false, posterizeLevels:4, useFindEdges:false,
                useBlendIf:false, blendIfChannel:'gray',
                blendIfThisBlack1:0, blendIfThisBlack2:0, blendIfThisWhite1:100, blendIfThisWhite2:100,
                blendIfUnderBlack1:0, blendIfUnderBlack2:0, blendIfUnderWhite1:100, blendIfUnderWhite2:100,
                colorMode: 'grayscale', colorA: '#ffffff', colorB: '#000000', palettePreset: 'custom',
                colorStops: [{ pos: 0, color: '#000000' }, { pos: 1, color: '#ffffff' }],
                hueShift: 0, saturation: 100, vibrance: 0, colorInvert: false };
        }

        function freshGlobalSettings() {
            return { gamma:1, contrast:1, vignette:0, 
                vignetteAmount: 0,
                vignetteMidpoint: 50,
                vignetteFeather: 50,
                vignetteRoundness: 0,
                vignetteHighlights: 0,
                vignetteCenterX: 0.5,
                vignetteCenterY: 0.5,
                grain:10, blur:0, blurType:'gaussian', blurClampEdge:false,
                globalZoom:1, globalScaleX:1, globalScaleY:1, globalRotation:0, globalOffsetX:0, globalOffsetY:0,
                globalPerspectiveV:0, globalPerspectiveH:0,
                tileMode:'off', tileRepeatX:2, tileRepeatY:2, tileMirrorX:true, tileMirrorY:true,
                tileSeamOffsetX:0, tileSeamOffsetY:0, blendCurve:'smooth',
                forceSeamless:false, forceSeamlessSoftness:1,
                globalHueShift: 0, globalSaturation: 100, globalVibrance: 0,
                globalColorTemp: 0, globalColorTint: 0,
                globalColorOverlay: '#000000', globalColorOverlayOpacity: 0,
                warps: [], warpOrder: 'transform_first' };
        }

        function addLayer(){
            let id='l'+Date.now();
            state.layers.unshift({id, name: t('new_layer_name'), visible:true, opacity:100, blendMode:'normal', generatorType:'simplex', isMask:false, params: freshLayerParams()});
            state.selectedLayerId=id; 
            commitHistorySnapshot();
            renderLayers();
            if (currentTab === 'maps') {
                if (window.mapGeneratorTab) window.mapGeneratorTab.renderRightPanelControls();
            } else {
                switchRightTab('layer');
            }
            requestRender();
        }
        function duplicateLayer(i){
            prepareStateForSerialization();
            let orig = state.layers[i];
            let newL = JSON.parse(JSON.stringify(orig));
            newL.id = 'l' + Date.now();
            newL.name = orig.name + ' ' + t('copy_suffix');
            state.layers.splice(i, 0, newL);
            state.selectedLayerId = newL.id; 
            commitHistorySnapshot();
            renderLayers();
            if (currentTab === 'maps') {
                if (window.mapGeneratorTab) window.mapGeneratorTab.renderRightPanelControls();
            } else {
                switchRightTab('layer');
            }
            requestRender();
        }
        function deleteLayer(i){
            if (i >= 0 && i < state.layers.length) {
                state.layers.splice(i, 1);
                if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                    state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
                }
                commitHistorySnapshot();
                renderLayers();
                if (currentTab === 'maps') {
                    if (window.mapGeneratorTab) window.mapGeneratorTab.renderRightPanelControls();
                } else if (currentTab === 'global') {
                    renderGlobal();
                } else {
                    renderProps();
                }
                requestRender();
            }
        }
        function moveLayer(i,d){ 
            if(i+d>=0 && i+d<state.layers.length){ 
                [state.layers[i],state.layers[i+d]]=[state.layers[i+d],state.layers[i]]; 
                commitHistorySnapshot();
                renderLayers(); requestRender(); 
            } 
        }
        function toggleMask(i) {
            let lay = state.layers[i];
            if (!lay) return;
            lay.isMask = !lay.isMask;
            renderLayers();
            requestRender();
            commitHistorySnapshot();
        }

        // --- Custom Confirm Modal & State Management ---
        function customConfirm(message, onConfirm) {
            console.log("customConfirm called with message:", message);
            const msgEl = $('confirmModalMessage');
            const btnEl = $('confirmModalBtn');
            const modalEl = $('confirmModal');
            if (msgEl && btnEl && modalEl) {
                msgEl.innerText = message;
                btnEl.onclick = function() {
                    modalEl.style.display = 'none';
                    if (onConfirm) onConfirm();
                };
                modalEl.style.display = 'flex';
            } else {
                if (confirm(message)) {
                    if (onConfirm) onConfirm();
                }
            }
        }

        function setState(v) {
            state = v;
            window.state = state;
        }

        // --- Скидання (Reset) ---
        function resetLayer(i) {
            console.log("resetLayer called for index:", i);
            let lay = state.layers[i];
            if (!lay) {
                console.error("resetLayer error: Layer not found at index", i);
                return;
            }
            customConfirm(t('reset_layer_confirm', {name: lay.name}), () => {
                console.log("resetLayer confirmed for:", lay.name);
                lay.params = freshLayerParams();
                lay.blendMode = 'normal';
                lay.opacity = 100;
                if (lay.paintCanvas) {
                    let pCtx = lay.paintCanvas.getContext('2d');
                    pCtx.fillStyle = '#000000';
                    pCtx.fillRect(0, 0, 1024, 1024);
                    updatePaintBuffer(lay);
                }
                lay.isDirty = true;
                renderLayers();
                renderStickyHeader();
                renderProps();
                requestRender();
                commitHistorySnapshot();
            });
        }
        window.resetLayer = resetLayer;
        function resetGlobalSettings() {
            console.log("resetGlobalSettings called");
            customConfirm(t('reset_global_confirm'), () => {
                console.log("resetGlobalSettings confirmed");
                state.global = freshGlobalSettings();
                invalidateCaches();
                renderGlobal(); requestRender();
            });
        }
        function resetProject() {
            console.log("resetProject called");
            customConfirm(t('reset_project_confirm'), () => {
                console.log("resetProject confirmed");
                let id = 'l'+Date.now();
                setState({
                    layers: [{ id, name: t('layer_default_name'), visible:true, opacity:100, blendMode:'normal', generatorType:'simplex', isMask:false, params: freshLayerParams() }],
                    selectedLayerId: id,
                    global: freshGlobalSettings()
                });
                invalidateCaches();
                renderLayers(); switchRightTab('layer'); requestRender();
            });
        }

        // --- Рандомізація алгоритму ---
        const GENERATOR_TYPES = ['gradient','simplex','perlin','voronoi','fbm','ridged','sine','radial','spiral','hexagon','pixel_noise','white_noise','checkerboard','dots','weave','value_noise','cellular','spider_web','cymatics', 'heartbeat', 'matrix_digits', 'paint'];

        // Рандомізує ВИКЛЮЧНО параметри алгоритму вибраного шару (сід, масштаб, зсув, кут, частоту тощо)
        // Свідомо НЕ торкається ефектів (threshold, levels, posterize, findEdges, invert, brightness, contrast, blur),
        // деформаторів (warps), режиму накладання, непрозорості чи назви шару.
        function randomizeAlgorithm(idx) {
            console.log("randomizeAlgorithm called for index:", idx);
            let lay = state.layers[idx];
            if (!lay) return;
            let p = lay.params;

            p.seed = Math.floor(Math.random() * 10000);
            p.scale = parseFloat((1 + Math.random() * 49).toFixed(1));
            p.scaleX = parseFloat((1 + Math.random() * 49).toFixed(1));
            p.scaleY = parseFloat((1 + Math.random() * 49).toFixed(1));
            p.offsetX = parseFloat(((Math.random() - 0.5) * 2).toFixed(2));
            p.offsetY = parseFloat(((Math.random() - 0.5) * 2).toFixed(2));
            p.angle = Math.floor((Math.random() - 0.5) * 360);
            p.layerScale = parseFloat((0.5 + Math.random() * 2).toFixed(1));

            if (lay.generatorType === 'simplex') {
                let modes = ['standard', 'ridged', 'billow', 'turbulence', 'swiss'];
                p.simplexMode = modes[Math.floor(Math.random() * modes.length)];
                p.octaves = 2 + Math.floor(Math.random() * 6);
                p.lacunarity = parseFloat((1.5 + Math.random() * 1.5).toFixed(1));
                p.gain = parseFloat((0.3 + Math.random() * 0.4).toFixed(2));
                p.warpStrength = Math.random() < 0.4 ? parseFloat((Math.random() * 1.2).toFixed(2)) : 0;
                p.warpFreq = parseFloat((0.5 + Math.random() * 2.0).toFixed(1));
                p.ridgePower = parseFloat((1.0 + Math.random() * 2.0).toFixed(1));
                p.seamless = Math.random() < 0.3;
            }
            if (['perlin', 'fbm', 'spiral'].includes(lay.generatorType)) {
                p.octaves = 1 + Math.floor(Math.random() * 8);
            }
            if (lay.generatorType === 'ridged') {
                let modes = ['ridges', 'valleys', 'dual', 'sharp_valley'];
                let noiseTypes = ['perlin', 'simplex', 'value', 'cellular'];
                p.ridgeMode = modes[Math.floor(Math.random() * modes.length)];
                p.ridgeNoiseType = noiseTypes[Math.floor(Math.random() * noiseTypes.length)];
                p.octaves = 1 + Math.floor(Math.random() * 7);
                p.ridgePower = parseFloat((0.5 + Math.random() * 3.0).toFixed(1));
                p.ridgeOffset = parseFloat((0.5 + Math.random() * 1.0).toFixed(2));
                p.ridgeAttenuation = parseFloat((1.0 + Math.random() * 2.5).toFixed(1));
                p.ridgeMultifractal = Math.random() > 0.15;
                p.lacunarity = parseFloat((1.5 + Math.random() * 1.5).toFixed(1));
                p.gain = parseFloat((0.3 + Math.random() * 0.4).toFixed(2));
                p.ridgeWarp = Math.random() < 0.4 ? parseFloat((Math.random() * 0.8).toFixed(2)) : 0;
            }
            if (lay.generatorType === 'voronoi') {
                let metrics = ['euclidean', 'manhattan', 'chebyshev'];
                let modes = ['f1', 'f2', 'f2_minus_f1'];
                p.metric = metrics[Math.floor(Math.random() * metrics.length)];
                p.mode = modes[Math.floor(Math.random() * modes.length)];
            }
            if (lay.generatorType === 'sine') {
                let modes = ['cross_add', 'grid_mult', 'horizontal', 'vertical', 'diagonal', 'radial', 'hex', 'cross_max', 'cross_diff'];
                let profiles = ['sine', 'cosine', 'triangle', 'square', 'absolute', 'sawtooth'];
                p.sineMode = modes[Math.floor(Math.random() * modes.length)];
                p.sineProfile = profiles[Math.floor(Math.random() * profiles.length)];
                p.sineAngle = Math.floor(Math.random() * 360) - 180;
                p.phase = parseFloat((Math.random() * 6.28).toFixed(2));
                p.sinePhaseX = Math.floor(Math.random() * 360);
                p.sinePhaseY = Math.floor(Math.random() * 360);
                p.sineSharpness = parseFloat((0.5 + Math.random() * 2.0).toFixed(1));
                p.sineOctaves = 1 + Math.floor(Math.random() * 3);
                p.sineGain = parseFloat((0.3 + Math.random() * 0.4).toFixed(2));
                p.sineWobble = Math.random() < 0.35 ? parseFloat((Math.random() * 0.5).toFixed(2)) : 0;
            }
            if (lay.generatorType === 'cymatics') {
                p.frequency = 10 + Math.floor(Math.random() * 150);
                p.phase = Math.floor(Math.random() * 360);
                p.sourcesCount = 1 + Math.floor(Math.random() * 12);
                p.symmetry = 1 + Math.floor(Math.random() * 12);
                p.isolineWidth = parseFloat((0.1 + Math.random() * 0.8).toFixed(2));
                let modes = ['Center', 'Corners', 'Edges', 'Ring', 'Polygon', 'Random'];
                p.sourceMode = modes[Math.floor(Math.random() * modes.length)];
            }
            if (lay.generatorType === 'spider_web') {
                p.radialCount = 4 + Math.floor(Math.random() * 32);
                p.ringCount = 4 + Math.floor(Math.random() * 32);
                p.ringThick = parseFloat((0.005 + Math.random() * 0.1).toFixed(3));
                p.radThick = parseFloat((0.005 + Math.random() * 0.1).toFixed(3));
                p.wobble = parseFloat((Math.random() * 0.1).toFixed(3));
                p.jitter = Math.floor(Math.random() * 15);
                p.fractal = parseFloat(Math.random().toFixed(2));
                p.ringSineAmp = parseFloat((Math.random() * 0.3).toFixed(2));
                p.ringSineFreq = 1 + Math.floor(Math.random() * 20);
                p.radSineAmp = parseFloat((Math.random() * 0.3).toFixed(2));
                p.radSineFreq = 1 + Math.floor(Math.random() * 20);
            }
            if (lay.generatorType === 'heartbeat') {
                p.hbLineCount = Math.floor(1 + Math.random() * 15);
                p.hbThickness = parseFloat((0.005 + Math.random() * 0.05).toFixed(3));
                p.hbAmplitude = parseFloat((0.1 + Math.random() * 0.6).toFixed(2));
                p.hbBeatsFreq = parseFloat((1 + Math.random() * 12).toFixed(1));
                p.hbPulseWidth = parseFloat((0.05 + Math.random() * 0.4).toFixed(2));
                p.hbDistortFreq = parseFloat((1 + Math.random() * 10).toFixed(1));
                p.hbDistortAmp = parseFloat((Math.random() * 0.2).toFixed(3));
                p.hbLayers = Math.floor(1 + Math.random() * 4);
                p.hbJitter = parseFloat((Math.random() * 0.4).toFixed(2));
                p.hbLineStyle = ['smooth', 'pixelated', 'dots', 'glow'][Math.floor(Math.random() * 4)];
                p.hbWaveType = ['ecg', 'pulse', 'sine_burst', 'triangle', 'noise_glitch'][Math.floor(Math.random() * 5)];
                p.hbOrientation = ['horizontal', 'vertical', 'angled', 'cross'][Math.floor(Math.random() * 4)];
                p.hbAngle = Math.floor(Math.random() * 180);
            }
            if (lay.generatorType === 'matrix_digits') {
                let charSets = ['binary', 'digits', 'hex', 'matrix_kanji', 'custom'];
                let fontStyles = ['pixel_5x7', 'pixel_3x5', 'digital_7seg'];
                p.matrixCharSet = charSets[Math.floor(Math.random() * charSets.length)];
                p.matrixDigitStyle = fontStyles[Math.floor(Math.random() * fontStyles.length)];
                p.matrixCustomChars = 'love';
                p.matrixWordMode = 'sequence';
                p.matrixCascade = 12;
                p.matrixCascadeFade = 1.0;
                p.matrixDensity = parseFloat((0.3 + Math.random() * 0.6).toFixed(2));
                p.matrixCloudNoise = parseFloat((Math.random() * 0.8).toFixed(2));
                p.matrixCloudFreq = parseFloat((1.0 + Math.random() * 6.0).toFixed(1));
                p.matrixDigitScale = parseFloat((0.7 + Math.random() * 0.5).toFixed(2));
                p.matrixGlow = parseFloat((Math.random() * 0.5).toFixed(2));
                p.matrixHeadGlow = parseFloat((Math.random() * 0.5).toFixed(2));
                p.matrixJitter = parseFloat((Math.random() * 0.4).toFixed(2));
                p.matrixSeed = Math.floor(Math.random() * 9999);
            }
            if (lay.generatorType === 'gradient') {
                let gradTypes = ['linear', 'radial', 'elliptical', 'conical', 'reflected', 'diamond'];
                let spreadMethods = ['clamp', 'repeat', 'reflect'];
                p.gradType = gradTypes[Math.floor(Math.random() * gradTypes.length)];
                p.spreadMethod = spreadMethods[Math.floor(Math.random() * spreadMethods.length)];
                p.centerX = parseFloat(Math.random().toFixed(2));
                p.centerY = parseFloat(Math.random().toFixed(2));
                p.aspectRatio = parseFloat((0.2 + Math.random() * 2.8).toFixed(2));
                p.midpoint = parseFloat((0.1 + Math.random() * 0.8).toFixed(2));
            }
            if (lay.generatorType === 'paint') {
                p.brushSize = 5 + Math.floor(Math.random() * 80);
                p.brushSpacing = 1 + Math.floor(Math.random() * 50);
                p.brushSoftness = parseFloat(Math.random().toFixed(2));
                p.brushFalloff = parseFloat((0.2 + Math.random() * 2).toFixed(1));
                p.brushAngle = Math.floor((Math.random() - 0.5) * 360);
                p.brushSquash = parseFloat((0.2 + Math.random() * 0.8).toFixed(2));
            }
            if (lay.generatorType === 'dots') {
                p.dotSize = parseFloat((0.05 + Math.random() * 0.4).toFixed(2));
                p.dotSoftness = parseFloat((Math.random() * 0.3).toFixed(2));
                let grids = ['square', 'staggered'];
                let shapes = ['circle', 'square', 'diamond'];
                p.dotGrid = grids[Math.floor(Math.random() * grids.length)];
                p.dotShape = shapes[Math.floor(Math.random() * shapes.length)];
            }
            if (lay.generatorType === 'pixel_noise') {
                p.pixelGap = parseFloat((Math.random() * 0.25).toFixed(2));
                p.pixelGapValue = parseFloat(Math.random().toFixed(2));
                p.pixelGapSoftness = parseFloat((Math.random() * 0.3).toFixed(2));
                let gridTypes = ['standard', 'staggered_h', 'staggered_v'];
                let shapes = ['square', 'round', 'circle', 'diamond'];
                let distributions = ['uniform', 'binary', 'stepped', 'gaussian', 'dither'];
                let bevelTypes = ['pyramid', 'soft', 'inset'];
                p.pixelGridType = gridTypes[Math.floor(Math.random() * gridTypes.length)];
                p.pixelShape = shapes[Math.floor(Math.random() * shapes.length)];
                p.pixelDistribution = distributions[Math.floor(Math.random() * distributions.length)];
                p.pixelBevelType = bevelTypes[Math.floor(Math.random() * bevelTypes.length)];
                p.pixelCornerRadius = parseFloat((0.05 + Math.random() * 0.2).toFixed(2));
                p.pixelThreshold = parseFloat((0.2 + Math.random() * 0.6).toFixed(2));
                p.pixelSteps = 2 + Math.floor(Math.random() * 8);
                p.pixelBevel = parseFloat((Math.random() * 0.8).toFixed(2));
                p.pixelSeed = Math.floor(Math.random() * 9999);
            }

            lay.isDirty = true;
            state.selectedLayerId = lay.id;
            renderProps();
            renderLayers();
            renderStickyHeader();
            requestRender();
            commitHistorySnapshot();
        }

        // Шар-маска (Clipping Mask): для кожної маски знаходить перший ВИДИМИЙ
        // НЕМАСКОВИЙ шар під нею (невидимі шари й інші маски підряд пропускаються
        // прозоро — п.5 ТЗ). Використовується і рендером, і панеллю шарів (UI),
        // щоб не дублювати логіку зв'язку маска -> ціль.
        function computeMaskRelationships() {
            let maskTargetIndex = new Array(state.layers.length).fill(-1); // маска -> індекс цілі (-1 = цілі немає)
            let clippedByMasks = new Array(state.layers.length).fill(null); // ціль -> список індексів масок, що її кліпають
            for (let i = 0; i < state.layers.length; i++) {
                if (!state.layers[i].visible || !state.layers[i].isMask) continue;
                let j = i + 1;
                while (j < state.layers.length && (!state.layers[j].visible || state.layers[j].isMask)) j++;
                if (j < state.layers.length) {
                    maskTargetIndex[i] = j;
                    (clippedByMasks[j] || (clippedByMasks[j] = [])).push(i);
                }
            }
            return { maskTargetIndex, clippedByMasks };
        }

        // Прапорець для пакетного застосування значень (рандомізація): поки true,
        // upd()/updateWarp()/updateScaleAxis() лише пишуть у стан, БЕЗ виклику
        // renderProject() на кожен окремий повзунок — інакше рандомізація шару з
        // десятком повзунків означала б десяток повних перерендерів поспіль.
        let suppressRender = false;

        // Скидає ОДИН повзунок (range або number) до значення за замовчуванням.
        // Використовується і кнопкою ↺, і подвійним тапом/кліком по самому повзунку.
        window.resetSliderEl = function(el, defaultVal) {
            if (!el) return;
            el.value = defaultVal;
            let sib = (el.nextElementSibling && el.nextElementSibling.tagName === 'INPUT') ? el.nextElementSibling
                     : (el.previousElementSibling && el.previousElementSibling.tagName === 'INPUT') ? el.previousElementSibling : null;
            if (sib) sib.value = defaultVal;
            el.dispatchEvent(new Event('input', {bubbles:true}));
        };

        // Рандомізує КОЖЕН видимий повзунок (крім позначених data-no-random) у
        // вказаному контейнері: випадкове значення в межах його ж min/max, з
        // прив'язкою до step, через ту саму подію 'input' (тобто відпрацьовує
        // вже наявний обробник кожного конкретного повзунка).
        function randomizeSlidersIn(containerEl) {
            suppressRender = true;
            containerEl.querySelectorAll('input[type=range]:not([data-no-random])').forEach(el => {
                let min = parseFloat(el.min), max = parseFloat(el.max), step = parseFloat(el.step) || 1;
                if (isNaN(min) || isNaN(max) || max <= min) return;
                let steps = Math.max(1, Math.round((max - min) / step));
                let val = min + Math.round(Math.random() * steps) * step;
                val = Math.min(max, Math.max(min, val));
                el.value = val;
                let sib = (el.nextElementSibling && el.nextElementSibling.tagName === 'INPUT') ? el.nextElementSibling : null;
                if (sib) sib.value = val;
                el.dispatchEvent(new Event('input', {bubbles:true}));
            });
            suppressRender = false;
        }

        window.toggleWarpExpanded = function(isGlobal, idx) {
            let w = isGlobal ? (state.global.warps && state.global.warps[idx]) : (state.selectedLayerId && state.layers.find(l=>l.id===state.selectedLayerId)?.params?.warps?.[idx]);
            if (!w) return;
            w.expanded = (w.expanded === undefined) ? false : !w.expanded;
            if (isGlobal) renderGlobal();
            else renderProps();
        };

        window.addWarp = function() {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay) return;
            if(!lay.params.warps) lay.params.warps = [];
            lay.params.warps.push({type: 'none', strength: 10, freq: 4, visible: true, expanded: true});
            lay.isDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.removeWarp = function(idx) {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.warps) return;
            lay.params.warps.splice(idx, 1);
            lay.isDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.toggleWarp = function(idx) {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.warps || !lay.params.warps[idx]) return;
            lay.params.warps[idx].visible = lay.params.warps[idx].visible === false ? true : false;
            lay.isDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.moveWarp = function(idx, direction) {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.warps) return;
            moveDeformer(lay.id, idx, direction);
        };

        window.moveDeformer = function(layerId, index, direction) {
            let lay = state.layers.find(l=>l.id===layerId);
            if (!lay || !lay.params || !lay.params.warps) return;
            let warps = lay.params.warps;
            let targetIdx = index + direction;
            if (targetIdx < 0 || targetIdx >= warps.length) return;

            let temp = warps[index];
            warps[index] = warps[targetIdx];
            warps[targetIdx] = temp;

            lay.isDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.updateWarp = function(idx, key, val) {
            let lay = state.layers.find(l=>l.id===state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.warps || !lay.params.warps[idx]) return;
            triggerInteraction();
            let isStrKey = (key === 'type' || key === 'dispMode' || key === 'falloff' || key === 'tileWrap');
            lay.params.warps[idx][key] = isStrKey ? val : parseFloat(val);
            if (key === 'type' && val === 'point_deformer') {
                if (!lay.params.warps[idx].points || lay.params.warps[idx].points.length === 0) {
                    lay.params.warps[idx].points = [{ id: 'pt_1', x: 256, y: 256, type: 'inflate', falloff: 'smooth', radius: 100, strength: 0.5, angle: 0 }];
                    lay.params.warps[idx].activePointIndex = 0;
                }
                if (lay.params.warps[idx].showHandles === undefined) lay.params.warps[idx].showHandles = true;
            } else if (key === 'type' && val === 'zoom_stretch') {
                let w = lay.params.warps[idx];
                if (w.centerX === undefined) w.centerX = 0.5;
                if (w.centerY === undefined) w.centerY = 0.5;
                if (w.strength === undefined) w.strength = 50;
                if (w.radius === undefined) w.radius = 500;
                if (w.falloff === undefined) w.falloff = 'zoom_rays';
                if (w.power === undefined) w.power = 1.0;
                if (w.twist === undefined) w.twist = 0;
                if (w.innerRadius === undefined) w.innerRadius = 0;
                if (w.tileWrap === undefined) w.tileWrap = 'none';
                if (w.showHandles === undefined) w.showHandles = true;
            }
            lay.isDirty = true;
            if (isStrKey) renderProps();
            if(!suppressRender) requestRender();
            if (isStrKey) {
                commitHistorySnapshot();
            } else {
                scheduleHistorySnapshot();
            }
        };

        window.addGlobalWarp = function() {
            if (!state.global) state.global = freshGlobalSettings();
            if (!state.global.warps) state.global.warps = [];
            state.global.warps.push({ type: 'none', strength: 10, freq: 4, visible: true, expanded: true });
            invalidateCaches();
            renderGlobal();
            requestRender();
            commitHistorySnapshot();
        };

        window.removeGlobalWarp = function(idx) {
            if (!state.global || !state.global.warps) return;
            state.global.warps.splice(idx, 1);
            invalidateCaches();
            renderGlobal();
            requestRender();
            commitHistorySnapshot();
        };

        window.toggleGlobalWarp = function(idx) {
            if (!state.global || !state.global.warps || !state.global.warps[idx]) return;
            state.global.warps[idx].visible = state.global.warps[idx].visible === false ? true : false;
            invalidateCaches();
            renderGlobal();
            requestRender();
            commitHistorySnapshot();
        };

        window.moveGlobalWarp = function(idx, direction) {
            if (!state.global || !state.global.warps) return;
            let warps = state.global.warps;
            let targetIdx = idx + direction;
            if (targetIdx < 0 || targetIdx >= warps.length) return;

            let temp = warps[idx];
            warps[idx] = warps[targetIdx];
            warps[targetIdx] = temp;

            invalidateCaches();
            renderGlobal();
            requestRender();
            commitHistorySnapshot();
        };

        window.updateGlobalWarp = function(idx, key, val) {
            if (!state.global || !state.global.warps || !state.global.warps[idx]) return;
            triggerInteraction();
            let isStrKey = (key === 'type' || key === 'dispMode' || key === 'falloff' || key === 'tileWrap');
            state.global.warps[idx][key] = isStrKey ? val : parseFloat(val);
            if (key === 'type' && val === 'point_deformer') {
                if (!state.global.warps[idx].points || state.global.warps[idx].points.length === 0) {
                    state.global.warps[idx].points = [{ id: 'pt_1', x: 256, y: 256, type: 'inflate', falloff: 'smooth', radius: 100, strength: 0.5, angle: 0 }];
                    state.global.warps[idx].activePointIndex = 0;
                }
                if (state.global.warps[idx].showHandles === undefined) state.global.warps[idx].showHandles = true;
            } else if (key === 'type' && val === 'zoom_stretch') {
                let w = state.global.warps[idx];
                if (w.centerX === undefined) w.centerX = 0.5;
                if (w.centerY === undefined) w.centerY = 0.5;
                if (w.strength === undefined) w.strength = 50;
                if (w.radius === undefined) w.radius = 500;
                if (w.falloff === undefined) w.falloff = 'zoom_rays';
                if (w.power === undefined) w.power = 1.0;
                if (w.twist === undefined) w.twist = 0;
                if (w.innerRadius === undefined) w.innerRadius = 0;
                if (w.tileWrap === undefined) w.tileWrap = 'none';
                if (w.showHandles === undefined) w.showHandles = true;
            }
            invalidateCaches();
            if (isStrKey) renderGlobal();
            if (!suppressRender) requestRender();
            if (isStrKey) {
                commitHistorySnapshot();
            } else {
                scheduleHistorySnapshot();
            }
        };

        // label, key, min, max, step, val, isGlobal, def (за замовчуванням = val), noRandom (виключити з рандомізації)
        function createSlider(label, key, min, max, step, val, isGlobal, def, noRandom) {
            let id = isGlobal ? 'glob_'+key : 'lay_'+key;
            if (def === undefined) def = val;
            let nr = noRandom ? ' data-no-random' : '';
            return `<div class="property-group">
                <label class="property-label">${t(label)}</label>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="range" id="rng_${id}" min="${min}" max="${max}" step="${step}" value="${val}"${nr} oninput="$('num_${id}').value=this.value; upd('${key}',this.value,${!!isGlobal})" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                    <input type="number" class="num-input" id="num_${id}" step="${step}" value="${val}" oninput="$('rng_${id}').value=this.value; upd('${key}',this.value,${!!isGlobal})" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                    <button type="button" class="reset-btn" title="${t('reset_default_title', {def})}" onclick="resetSliderEl($('rng_${id}'),${def})">↺</button>
                </div>
            </div>`;
        }

        // Легкий варіант без id — для одноразових (ad-hoc) повзунків типу Threshold/Levels/Warp,
        // де inline-обробник вже сам синхронізує пару range/number через сусідні елементи.
        function sliderRow(min, max, step, val, def, onInputExpr) {
            return `<div style="display:flex; gap:6px; align-items:center;">
                <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" oninput="this.nextElementSibling.value=this.value; ${onInputExpr}" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                <input type="number" class="num-input" step="${step}" value="${val}" oninput="this.previousElementSibling.value=this.value; ${onInputExpr}" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,${def})">
                <button type="button" class="reset-btn" title="Скинути за замовчуванням (${def})" onclick="resetSliderEl(this.parentElement.querySelector('input[type=range]'),${def})">↺</button>
            </div>`;
        }

        function createScaleSlider(label, key, val) {
            const id = `scale_${key}`;
            return `<div class="property-group">
                <label class="property-label">${label}</label>
                <div style="display:flex; gap:6px; align-items:center;">
                    <input type="range" id="rng_${id}" min="1" max="100" step="0.5" value="${val}" oninput="$('num_${id}').value=this.value; updateScaleAxis('${key}', this.value)" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,10)">
                    <input type="number" class="num-input" id="num_${id}" min="1" max="100" step="0.5" value="${val}" oninput="$('rng_${id}').value=this.value; updateScaleAxis('${key}', this.value)" onchange="commitHistorySnapshot();" ondblclick="resetSliderEl(this,10)">
                    <button type="button" class="reset-btn" title="Скинути за замовчуванням (10)" onclick="resetSliderEl($('rng_${id}'),10)">↺</button>
                </div>
            </div>`;
        }

        function updateScaleAxis(key, value) {
            const lay = state.layers.find(layer => layer.id === state.selectedLayerId);
            if(!lay) return;
            triggerInteraction();
            const scale = Math.max(1, Math.min(100, parseFloat(value) || 1));
            lay.params[key] = scale;
            lay.isDirty = true;
            if(lay.params.lockScale) {
                const otherKey = key === 'scaleX' ? 'scaleY' : 'scaleX';
                lay.params[otherKey] = scale;
                const otherId = `num_scale_${otherKey}`;
                const otherRange = `rng_scale_${otherKey}`;
                if($(otherId)) $(otherId).value = scale;
                if($(otherRange)) $(otherRange).value = scale;
            }
            if(!suppressRender) requestRender();
        }

        window.addGradientStop = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            if (!lay.params.stops) lay.params.stops = [];
            let newPos = 0.5;
            if (lay.params.stops.length >= 2) {
                let sorted = lay.params.stops.slice().sort((a, b) => a.pos - b.pos);
                newPos = (sorted[0].pos + sorted[sorted.length - 1].pos) / 2;
            }
            lay.params.stops.push({ pos: newPos, color: '#888888', val: 0.5 });
            lay.params.stops.sort((a, b) => a.pos - b.pos);
            lay.isDirty = true;
            lay.params._stopsDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.removeGradientStop = function(idx) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.stops || lay.params.stops.length <= 2) return;
            lay.params.stops.splice(idx, 1);
            lay.isDirty = true;
            lay.params._stopsDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.updateGradientStop = function(idx, key, val) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.stops || !lay.params.stops[idx]) return;
            triggerInteraction();
            let stop = lay.params.stops[idx];
            if (key === 'color') {
                stop.color = val;
            } else {
                stop[key] = parseFloat(val);
            }
            lay.isDirty = true;
            lay.params._stopsDirty = true;

            let lblPos = $('lbl_stop_pos_' + idx);
            if (lblPos) lblPos.innerText = 'Поз: ' + Math.round(stop.pos * 100) + '%';

            let lblVal = $('lbl_stop_val_' + idx);
            if (lblVal) lblVal.innerText = 'Вис: ' + (stop.val !== undefined ? stop.val : stop.pos).toFixed(2);

            let sortedStops = lay.params.stops.slice().sort((a, b) => a.pos - b.pos);
            let cssStopsStr = sortedStops.map(s => `${s.color || '#888888'} ${Math.round(s.pos * 100)}%`).join(', ');
            let rampEl = $('gradientRampPreview');
            if (rampEl) rampEl.style.background = `linear-gradient(to right, ${cssStopsStr})`;

            if (!suppressRender) requestRender();
        };

        window.finishGradientStopEdit = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.stops) return;
            lay.params.stops.sort((a, b) => a.pos - b.pos);
            lay.params._stopsDirty = true;
            renderProps();
            commitHistorySnapshot();
        };

        window.applyGradientPreset = function(presetName) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            switch (presetName) {
                case 'bw':
                    lay.params.stops = [
                        { pos: 0.0, color: '#000000', val: 0.0 },
                        { pos: 1.0, color: '#ffffff', val: 1.0 }
                    ];
                    break;
                case 'chrome':
                    lay.params.stops = [
                        { pos: 0.0, color: '#111111', val: 0.0 },
                        { pos: 0.25, color: '#ffffff', val: 1.0 },
                        { pos: 0.48, color: '#222222', val: 0.1 },
                        { pos: 0.5, color: '#ffffff', val: 1.0 },
                        { pos: 0.75, color: '#333333', val: 0.2 },
                        { pos: 1.0, color: '#eeeeee', val: 0.9 }
                    ];
                    break;
                case 'gold':
                    lay.params.stops = [
                        { pos: 0.0, color: '#4a2c00', val: 0.1 },
                        { pos: 0.35, color: '#ffd700', val: 0.8 },
                        { pos: 0.5, color: '#fff8dc', val: 1.0 },
                        { pos: 0.65, color: '#daa520', val: 0.7 },
                        { pos: 1.0, color: '#3b2200', val: 0.1 }
                    ];
                    break;
                case 'sunset':
                    lay.params.stops = [
                        { pos: 0.0, color: '#2d0b5a', val: 0.0 },
                        { pos: 0.4, color: '#c72c61', val: 0.4 },
                        { pos: 0.7, color: '#ff6b35', val: 0.7 },
                        { pos: 1.0, color: '#f7c548', val: 1.0 }
                    ];
                    break;
                case 'cyber':
                    lay.params.stops = [
                        { pos: 0.0, color: '#00f2fe', val: 0.0 },
                        { pos: 0.5, color: '#4facfe', val: 0.5 },
                        { pos: 1.0, color: '#000000', val: 1.0 }
                    ];
                    break;
                case 'rainbow':
                    lay.params.stops = [
                        { pos: 0.0, color: '#ff0000', val: 0.0 },
                        { pos: 0.2, color: '#ffff00', val: 0.2 },
                        { pos: 0.4, color: '#00ff00', val: 0.4 },
                        { pos: 0.6, color: '#00ffff', val: 0.6 },
                        { pos: 0.8, color: '#0000ff', val: 0.8 },
                        { pos: 1.0, color: '#ff00ff', val: 1.0 }
                    ];
                    break;
            }
            lay.isDirty = true;
            lay.params._stopsDirty = true;
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.applyPalettePresetToLayer = function(presetKey) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            lay.params.palettePreset = presetKey;
            if (presetKey !== 'custom' && PALETTE_PRESETS[presetKey]) {
                lay.params.colorStops = JSON.parse(JSON.stringify(PALETTE_PRESETS[presetKey]));
            }
            lay.params.colorMode = 'color_ramp';
            lay.isDirty = true;
            renderProps();
            requestRender();
            scheduleHistorySnapshot();
        };

        window.addColorRampStop = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            if (!lay.params.colorStops) lay.params.colorStops = [{ pos: 0, color: '#000000' }, { pos: 1, color: '#ffffff' }];
            let stops = lay.params.colorStops;
            let newPos = 0.5;
            if (stops.length >= 2) {
                let sorted = stops.slice().sort((a, b) => a.pos - b.pos);
                newPos = (sorted[0].pos + sorted[sorted.length - 1].pos) / 2;
            }
            stops.push({ pos: newPos, color: '#888888' });
            stops.sort((a, b) => a.pos - b.pos);
            lay.params.palettePreset = 'custom';
            lay.params.colorMode = 'color_ramp';
            lay.isDirty = true;
            renderProps();
            requestRender();
            scheduleHistorySnapshot();
        };

        window.removeColorRampStop = function(idx) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params || !lay.params.colorStops || lay.params.colorStops.length <= 2) return;
            lay.params.colorStops.splice(idx, 1);
            lay.params.palettePreset = 'custom';
            lay.isDirty = true;
            renderProps();
            requestRender();
            scheduleHistorySnapshot();
        };

        window.updateColorRampStop = function(idx, key, val) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            if (!lay.params.colorStops) {
                if (lay.params.stops) lay.params.colorStops = JSON.parse(JSON.stringify(lay.params.stops));
                else lay.params.colorStops = [{ pos: 0, color: '#000000' }, { pos: 1, color: '#ffffff' }];
            }
            if (!lay.params.colorStops[idx]) return;
            triggerInteraction();
            let stop = lay.params.colorStops[idx];
            if (key === 'color') stop.color = val;
            else stop.pos = parseFloat(val);
            lay.params.palettePreset = 'custom';
            lay.isDirty = true;

            let sortedStops = lay.params.colorStops.slice().sort((a, b) => a.pos - b.pos);
            let cssStopsStr = sortedStops.map(s => `${s.color || '#888888'} ${Math.round(s.pos * 100)}%`).join(', ');
            let rampEl = $('layerColorRampPreview');
            if (rampEl) rampEl.style.background = `linear-gradient(to right, ${cssStopsStr})`;

            if (!suppressRender) requestRender();
        };

        window.updateBlendIfRampInDOM = function(k1) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            let lp = lay.params;
            let isThis = k1.includes('This');
            let rampId = isThis ? 'ramp_this' : 'ramp_under';
            let rampEl = $(rampId);
            if (!rampEl) return;
            let b1 = isThis ? (lp.blendIfThisBlack1 || 0) : (lp.blendIfUnderBlack1 || 0);
            let b2 = isThis ? (lp.blendIfThisBlack2 || 0) : (lp.blendIfUnderBlack2 || 0);
            let w1 = isThis ? (lp.blendIfThisWhite1 !== undefined ? lp.blendIfThisWhite1 : 100) : (lp.blendIfUnderWhite1 !== undefined ? lp.blendIfUnderWhite1 : 100);
            let w2 = isThis ? (lp.blendIfThisWhite2 !== undefined ? lp.blendIfThisWhite2 : 100) : (lp.blendIfUnderWhite2 !== undefined ? lp.blendIfUnderWhite2 : 100);

            let p_b1 = Math.round(b1);
            let p_b2 = Math.round(b2);
            let p_w1 = Math.round(w1);
            let p_w2 = Math.round(w2);
            rampEl.style.background = `linear-gradient(to right, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0) ${p_b1}%, 
                rgba(59,130,246,0.9) ${p_b2}%, 
                rgba(59,130,246,0.9) ${p_w1}%, 
                rgba(255,255,255,0) ${p_w2}%, 
                rgba(255,255,255,0) 100%)`;
        };

        window.toggleBlendIfActive = function(checked) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            lay.params.useBlendIf = !!checked;
            if (checked && lay.params.blendIfExpanded === undefined) {
                lay.params.blendIfExpanded = true;
            }
            if (!suppressRender) requestRender();
            renderProps();
            scheduleHistorySnapshot();
        };

        window.toggleBlendIfExpand = function() {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            let isExpanded = lay.params.blendIfExpanded !== undefined ? lay.params.blendIfExpanded : false;
            lay.params.blendIfExpanded = !isExpanded;
            renderProps();
        };

        window.updateBlendIfRange = function(k1, val1, k2, val2) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            triggerInteraction();

            val1 = parseFloat(val1);
            val2 = parseFloat(val2);

            if (val1 > val2) {
                if (typeof event !== 'undefined' && event && event.target && event.target.id && event.target.id.includes(k1)) {
                    val2 = val1;
                    let el2 = $('rng_' + k2);
                    if (el2) el2.value = val2;
                } else {
                    val1 = val2;
                    let el1 = $('rng_' + k1);
                    if (el1) el1.value = val1;
                }
            }

            lay.params[k1] = val1;
            lay.params[k2] = val2;

            let lbl = $('lbl_' + k1 + '_' + k2);
            if (lbl) lbl.innerText = `${Math.round(val1)}% … ${Math.round(val2)}%`;

            updateBlendIfRampInDOM(k1);

            if (!suppressRender) requestRender();
        };

        function renderBlendIfRampPreview(b1, b2, w1, w2, id = '') {
            let p_b1 = Math.round(b1);
            let p_b2 = Math.round(b2);
            let p_w1 = Math.round(w1);
            let p_w2 = Math.round(w2);
            return `
            <div ${id ? `id="${id}"` : ''} style="height:8px; border-radius:3px; border:1px solid rgba(255,255,255,0.15); background: linear-gradient(to right, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0) ${p_b1}%, 
                rgba(59,130,246,0.9) ${p_b2}%, 
                rgba(59,130,246,0.9) ${p_w1}%, 
                rgba(255,255,255,0) ${p_w2}%, 
                rgba(255,255,255,0) 100%); margin: 4px 0 8px 0;" title="Діапазон видимості (Синій = 100% видимий, градієнт = м'який спад)"></div>`;
        }

        function blendIfRow(label, k1, k2, v1, v2) {
            return `
            <div style="margin-bottom:6px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                    <span style="font-size:10px; font-weight:600; color:var(--text-muted);">${label}</span>
                    <span id="lbl_${k1}_${k2}" style="font-size:10px; font-weight:700; color:var(--primary-color, #3b82f6);">${Math.round(v1)}% … ${Math.round(v2)}%</span>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; align-items:center;">
                    <div>
                        <label style="font-size:9px; color:var(--text-muted); display:block; margin-bottom:1px;">Поріг (Min)</label>
                        <input type="range" min="0" max="100" step="1" value="${v1}" id="rng_${k1}" oninput="updateBlendIfRange('${k1}', this.value, '${k2}', $('rng_${k2}').value)" onchange="commitHistorySnapshot();" style="width:100%;">
                    </div>
                    <div>
                        <label style="font-size:9px; color:var(--text-muted); display:block; margin-bottom:1px;">Розщеплення (Max)</label>
                        <input type="range" min="0" max="100" step="1" value="${v2}" id="rng_${k2}" oninput="updateBlendIfRange('${k1}', $('rng_${k1}').value, '${k2}', this.value)" onchange="commitHistorySnapshot();" style="width:100%;">
                    </div>
                </div>
            </div>`;
        }

        // --- Accordion Blocks & Drag-and-Drop Reordering State ---
        let accordionConfig = {
            layer: {
                order: ['algo', 'color', 'transform', 'fx', 'warps'],
                states: { algo: false, color: true, transform: false, fx: false, warps: false }
            },
            global: {
                order: ['transform', 'color', 'warps', 'tiling', 'fx'],
                states: { transform: false, color: true, warps: false, tiling: false, fx: false }
            }
        };

        try {
            let savedAcc = localStorage.getItem('veil_accordion_config');
            if (savedAcc) {
                let parsed = JSON.parse(savedAcc);
                if (parsed.layer && Array.isArray(parsed.layer.order)) {
                    accordionConfig.layer.order = parsed.layer.order.filter(k => k !== 'blend');
                    if (!accordionConfig.layer.order.includes('color')) {
                        accordionConfig.layer.order.splice(1, 0, 'color');
                    }
                    if (parsed.layer.states) accordionConfig.layer.states = Object.assign({ color: true }, parsed.layer.states);
                }
                if (parsed.global && Array.isArray(parsed.global.order)) {
                    accordionConfig.global.order = parsed.global.order;
                    if (!accordionConfig.global.order.includes('color')) {
                        accordionConfig.global.order.splice(1, 0, 'color');
                    }
                    if (!accordionConfig.global.order.includes('warps')) {
                        accordionConfig.global.order.push('warps');
                    }
                    if (parsed.global.states) accordionConfig.global.states = Object.assign({ color: true }, parsed.global.states);
                }
            }
        } catch(e) {}

        function saveAccordionConfig() {
            try {
                localStorage.setItem('veil_accordion_config', JSON.stringify(accordionConfig));
            } catch(e) {}
        }

        window.toggleAccordionBlock = function(tab, id) {
            if (accordionConfig[tab] && accordionConfig[tab].states) {
                accordionConfig[tab].states[id] = !accordionConfig[tab].states[id];
                saveAccordionConfig();
                if (tab === 'layer') renderProps();
                else if (tab === 'global') renderGlobal();
            }
        };

        let pointerAccDragState = null;

        window.handleAccPointerDown = function(e, tab, id) {
            if (e.button !== undefined && e.button !== 0) return;
            e.stopPropagation();
            let handle = e.currentTarget;
            let block = handle.closest('.accordion-block');
            if (!block) return;

            pointerAccDragState = {
                tab: tab,
                id: id,
                blockEl: block
            };

            try { handle.setPointerCapture(e.pointerId); } catch(err) {}
            block.classList.add('dragging');

            handle.onpointermove = function(ev) {
                if (!pointerAccDragState) return;
                let targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
                let targetBlock = targetEl ? targetEl.closest('.accordion-block') : null;
                document.querySelectorAll('.accordion-block').forEach(b => b.classList.remove('drag-over'));
                if (targetBlock && targetBlock !== pointerAccDragState.blockEl && targetBlock.dataset.accTab === pointerAccDragState.tab) {
                    targetBlock.classList.add('drag-over');
                }
            };

            handle.onpointerup = handle.onpointercancel = function(ev) {
                if (!pointerAccDragState) return;
                let targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
                let targetBlock = targetEl ? targetEl.closest('.accordion-block') : null;
                if (targetBlock && targetBlock.dataset.accTab === pointerAccDragState.tab && targetBlock.dataset.accId !== pointerAccDragState.id) {
                    let targetId = targetBlock.dataset.accId;
                    let tab = pointerAccDragState.tab;
                    let order = accordionConfig[tab].order;
                    let fromIdx = order.indexOf(pointerAccDragState.id);
                    let toIdx = order.indexOf(targetId);
                    if (fromIdx !== -1 && toIdx !== -1) {
                        order.splice(fromIdx, 1);
                        order.splice(toIdx, 0, pointerAccDragState.id);
                        saveAccordionConfig();
                        if (tab === 'layer') renderProps();
                        else renderGlobal();
                    }
                }
                document.querySelectorAll('.accordion-block').forEach(b => b.classList.remove('dragging', 'drag-over'));
                try { handle.releasePointerCapture(ev.pointerId); } catch(err) {}
                handle.onpointermove = null;
                handle.onpointerup = null;
                handle.onpointercancel = null;
                pointerAccDragState = null;
            };
        };

        window.updWarpOrder = function(val) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            if (!lay || !lay.params) return;
            lay.params.warpOrder = val;
            lay.isDirty = true;
            invalidateCaches();
            renderProps();
            requestRender();
            commitHistorySnapshot();
        };

        window.updGlobalWarpOrder = function(val) {
            if (!state.global) state.global = freshGlobalSettings();
            state.global.warpOrder = val;
            invalidateCaches();
            renderGlobal();
            requestRender();
            commitHistorySnapshot();
        };

        function renderWarpOrderToggle(currentVal, onChangeJS, isGlobal = false) {
            let val = currentVal || 'transform_first';
            let isTransformFirst = (val === 'transform_first');
            return `
                <div class="property-group" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color, #27272a); border-radius: 8px; padding: 8px 10px; margin-bottom: 10px;">
                    <div style="font-size:11px; font-weight:700; color:var(--primary-color, #3b82f6); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                        <span>🔄 Порядок деформації (${isGlobal ? 'Глобальний' : 'Шар'})</span>
                    </div>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr); gap:6px;">
                        <button type="button" onclick="${onChangeJS}('transform_first');" class="gen-btn ${isTransformFirst ? 'active' : ''}" style="font-size:10px; padding:6px 4px; text-align:center; height:auto; line-height:1.2;" title="Деформатор підпорядкований трансформації: деформується разом із кутом повороту, масштабом та перспективою">
                            <div style="font-weight:700;">⛓️ В рамках</div>
                            <div style="font-size:8.5px; opacity:0.8; margin-top:2px;">Підпорядковано</div>
                        </button>
                        <button type="button" onclick="${onChangeJS}('warp_first');" class="gen-btn ${!isTransformFirst ? 'active' : ''}" style="font-size:10px; padding:6px 4px; text-align:center; height:auto; line-height:1.2;" title="Деформатор накладається незалежно поверх трансформації без спотворення вектора викривлення">
                            <div style="font-weight:700;">🎯 Над ним</div>
                            <div style="font-size:8.5px; opacity:0.8; margin-top:2px;">Незалежно</div>
                        </button>
                    </div>
                </div>
            `;
        }

        function renderAccordionBlock(tab, id, title, icon, contentHTML) {
            let isExpanded = accordionConfig[tab].states[id] === true;
            return `
            <div class="accordion-block" 
                 data-acc-tab="${tab}" 
                 data-acc-id="${id}">
                <div class="accordion-header" onclick="toggleAccordionBlock('${tab}', '${id}')" title="Натисніть для розгортання/згортання">
                    <div class="accordion-header-left">
                        <span class="drag-handle" title="Затисніть мишою або пальцем та перетягніть" onpointerdown="handleAccPointerDown(event, '${tab}', '${id}')" onclick="event.stopPropagation()">⣿</span>
                        <span>${icon} ${title}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span class="accordion-chevron ${isExpanded ? 'open' : ''}">▼</span>
                    </div>
                </div>
                <div class="accordion-body ${isExpanded ? '' : 'collapsed'}">
                    ${contentHTML}
                </div>
            </div>`;
        }

        function renderProps() {
            let lay=state.layers.find(l=>l.id===state.selectedLayerId), p=$('propertiesPanel');
            if(!lay) return p.innerHTML = '<div class="empty-state">Виберіть шар</div>';
            let lp = lay.params;
            ['offsetX','offsetY','angle','phase'].forEach(k=>lp[k]=lp[k]||0);
            ['scaleX','scaleY'].forEach(k=>lp[k]=lp[k]||lp.scale||10);
            if(lp.layerScale===undefined) lp.layerScale=1;
            if(lp.lockScale===undefined) lp.lockScale=true;
            if(lp.brightness===undefined) lp.brightness=1;
            if(!lp.warps) lp.warps = [];

            if (lay.generatorType === 'cymatics') {
                if (lp.frequency === undefined) lp.frequency = 50;
                if (lp.phase === undefined) lp.phase = 0;
                if (lp.sourcesCount === undefined) lp.sourcesCount = 4;
                if (lp.symmetry === undefined) lp.symmetry = 1;
                if (lp.isolineWidth === undefined) lp.isolineWidth = 0.5;
            }

            if (lay.generatorType === 'gradient') {
                if (!lp.gradType) lp.gradType = 'linear';
                if (!lp.spreadMethod) lp.spreadMethod = 'clamp';
                if (lp.centerX === undefined) lp.centerX = 0.5;
                if (lp.centerY === undefined) lp.centerY = 0.5;
                if (lp.aspectRatio === undefined) lp.aspectRatio = 1.0;
                if (lp.midpoint === undefined) lp.midpoint = 0.5;
                if (!lp.stops || !Array.isArray(lp.stops) || lp.stops.length === 0) {
                    lp.stops = [
                        { pos: 0.0, color: '#000000', val: 0.0 },
                        { pos: 1.0, color: '#ffffff', val: 1.0 }
                    ];
                }
            }

            // --- Constructing Accordion Content Blocks for Layer Properties ---
            let layerBlockContents = {};

            // Block: algo
            let algoSpecificHTML = '';
            if (lay.generatorType === 'paint') {
                ensureLayerPaintCanvas(lay);
                lp.brushColor = lp.brushColor || '#ffffff';
                lp.brushSize = lp.brushSize || 20;
                lp.brushSpacing = lp.brushSpacing !== undefined ? lp.brushSpacing : 10;
                lp.brushOpacity = lp.brushOpacity !== undefined ? lp.brushOpacity : 100;
                lp.brushSoftness = lp.brushSoftness !== undefined ? lp.brushSoftness : 0.5;
                lp.brushFalloff = lp.brushFalloff !== undefined ? lp.brushFalloff : 1.0;
                lp.brushAngle = lp.brushAngle !== undefined ? lp.brushAngle : 0;
                lp.brushSquash = lp.brushSquash !== undefined ? lp.brushSquash : 1.0;
                lp.brushTool = lp.brushTool || 'brush';

                algoSpecificHTML += `
                <div class="section-title">Малювання (Brush Canvas)</div>
                <div class="property-group">
                    <label class="property-label">Інструмент</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        <button onclick="upd('brushTool','brush')" class="gen-btn ${lp.brushTool==='brush'?'active':''}">Пензель</button>
                        <button onclick="upd('brushTool','eraser')" class="gen-btn ${lp.brushTool==='eraser'?'active':''}">Гумка</button>
                    </div>
                </div>
                <div class="property-group">
                    <label class="property-label">Колір пензля (висота/маска)</label>
                    <input type="color" value="${lp.brushColor}" oninput="upd('brushColor', this.value)" style="width:100%; height:32px; background:none; border:1px solid var(--border-color); border-radius:4px; cursor:pointer;">
                </div>
                ${createSlider("Розмір пензля", "brushSize", 1, 200, 1, lp.brushSize, false, 20)}
                ${createSlider("Інтервал (Крок)", "brushSpacing", 1, 200, 1, lp.brushSpacing, false, 10)}
                ${createSlider("Сила (Непрозорість %)", "brushOpacity", 1, 100, 1, lp.brushOpacity, false, 100)}
                ${createSlider("Зона м'якості", "brushSoftness", 0, 1, 0.01, lp.brushSoftness, false, 0.5)}
                ${createSlider("Спад градієнта", "brushFalloff", 0.1, 4, 0.1, lp.brushFalloff, false, 1.0)}
                ${createSlider("Кут нахилу пензля", "brushAngle", -180, 180, 1, lp.brushAngle, false, 0)}
                ${createSlider("Форма (Стиснення)", "brushSquash", 0.1, 1, 0.05, lp.brushSquash, false, 1.0)}
                
                <div style="margin-top:12px; display:flex; gap:10px;">
                    <button onclick="clearPaintCanvas()" class="btn btn-secondary" style="color:#ef4444; border-color:rgba(239,68,68,0.2); width:100%;">Очистити полотно</button>
                </div>
                `;

                setTimeout(() => { updateBrushPreview(); }, 0);
            }

            if (lay.generatorType === 'cymatics') {
                algoSpecificHTML += `<div class="section-title">Cymatics</div>`;
                algoSpecificHTML += createSlider("Частота", "frequency", 1, 300, 1, lp.frequency, false, 50);
                algoSpecificHTML += createSlider("Фаза", "phase", 0, 360, 1, lp.phase, false, 0);
                algoSpecificHTML += `<div class="property-group"><label class="property-label">Джерело (Source)</label><select class="form-control" onchange="upd('sourceMode', this.value)"><option value="Center" ${lp.sourceMode==='Center'?'selected':''}>Center</option><option value="Corners" ${lp.sourceMode==='Corners'?'selected':''}>Corners</option><option value="Edges" ${lp.sourceMode==='Edges'?'selected':''}>Edges</option><option value="Ring" ${lp.sourceMode==='Ring'?'selected':''}>Ring</option><option value="Polygon" ${lp.sourceMode==='Polygon'?'selected':''}>Polygon</option><option value="Random" ${lp.sourceMode==='Random'?'selected':''}>Random</option></select></div>`;
                algoSpecificHTML += createSlider("К-ть Джерел", "sourcesCount", 1, 64, 1, lp.sourcesCount, false, 4);
                algoSpecificHTML += createSlider("Симетрія", "symmetry", 1, 24, 1, lp.symmetry, false, 1);
                algoSpecificHTML += createSlider("Товщина лінії", "isolineWidth", 0, 1, 0.01, lp.isolineWidth, false, 0.5);
            }

            if (lay.generatorType === 'heartbeat') {
                algoSpecificHTML += `<div class="section-title">Серцебиття та ЕКГ (Heartbeat Lines Generator)</div>`;

                algoSpecificHTML += `<div class="property-group grid-2">
                    <div>
                        <label class="property-label">Орієнтація / Напрямок</label>
                        <select class="form-control" onchange="upd('hbOrientation', this.value); renderProps();">
                            <option value="horizontal" ${(lp.hbOrientation||'horizontal')==='horizontal'?'selected':''}>Горизонтальні лінії</option>
                            <option value="vertical" ${lp.hbOrientation==='vertical'?'selected':''}>Вертикальні лінії</option>
                            <option value="angled" ${lp.hbOrientation==='angled'?'selected':''}>Під кутом (Angled)</option>
                            <option value="cross" ${lp.hbOrientation==='cross'?'selected':''}>Перехресна сітка (Cross Grid)</option>
                        </select>
                    </div>
                    <div>
                        <label class="property-label">Форма імпульсу (Wave Shape)</label>
                        <select class="form-control" onchange="upd('hbWaveType', this.value)">
                            <option value="ecg" ${(lp.hbWaveType||'ecg')==='ecg'?'selected':''}>💓 Кардіограма (ECG PQRST)</option>
                            <option value="pulse" ${lp.hbWaveType==='pulse'?'selected':''}>⚡ Гострий імпульс (Pulse Spike)</option>
                            <option value="sine_burst" ${lp.hbWaveType==='sine_burst'?'selected':''}>🌊 Синусоїдальний спалах (Sine Burst)</option>
                            <option value="triangle" ${lp.hbWaveType==='triangle'?'selected':''}>📐 Трикутні піки (Triangle)</option>
                            <option value="square" ${lp.hbWaveType==='square'?'selected':''}>🔲 Прямокутні меандри (Square)</option>
                            <option value="noise_glitch" ${lp.hbWaveType==='noise_glitch'?'selected':''}>🤖 Кібер-глітч (Cyber Glitch)</option>
                        </select>
                    </div>
                </div>`;

                if ((lp.hbOrientation || 'horizontal') === 'angled') {
                    algoSpecificHTML += createSlider("Кут нахилу (°)", "hbAngle", 0, 360, 1, lp.hbAngle !== undefined ? lp.hbAngle : 0, false, 0);
                }

                algoSpecificHTML += `<div class="property-group grid-2">
                    <div>
                        <label class="property-label">Стиль лінії (Line Rendering)</label>
                        <select class="form-control" onchange="upd('hbLineStyle', this.value); renderProps();">
                            <option value="smooth" ${(lp.hbLineStyle||'smooth')==='smooth'?'selected':''}>✨ Плавна гладка (Smooth)</option>
                            <option value="pixelated" ${lp.hbLineStyle==='pixelated'?'selected':''}>👾 Піксельна / 8-Bit (Pixelated)</option>
                            <option value="dots" ${lp.hbLineStyle==='dots'?'selected':''}>🔘 Точкова / Пунктир (Dotted)</option>
                            <option value="glow" ${lp.hbLineStyle==='glow'?'selected':''}>🌟 Неонове світіння (Glow/Neon)</option>
                        </select>
                    </div>
                    <div>
                        <label class="property-label">Полярність піків</label>
                        <select class="form-control" onchange="upd('hbBipolar', this.value)">
                            <option value="unipolar" ${(lp.hbBipolar||'unipolar')==='unipolar'?'selected':''}>Одностороння (Unipolar)</option>
                            <option value="bipolar" ${lp.hbBipolar==='bipolar'?'selected':''}>Двостороння (Bipolar / Up & Down)</option>
                            <option value="absolute" ${lp.hbBipolar==='absolute'?'selected':''}>Абсолютна (Positive Only)</option>
                        </select>
                    </div>
                </div>`;

                if ((lp.hbLineStyle || 'smooth') === 'pixelated') {
                    algoSpecificHTML += createSlider("Розмір пікселя (Pixel Grid)", "hbPixelSize", 1, 32, 1, lp.hbPixelSize !== undefined ? lp.hbPixelSize : 8, false, 8);
                }

                algoSpecificHTML += createSlider("Кількість ліній", "hbLineCount", 1, 100, 1, lp.hbLineCount !== undefined ? lp.hbLineCount : 5, false, 5);
                algoSpecificHTML += createSlider("Товщина ліній", "hbThickness", 0.001, 0.15, 0.001, lp.hbThickness !== undefined ? lp.hbThickness : 0.02, false, 0.02);
                algoSpecificHTML += createSlider("Амплітуда спалахів (Spike Height)", "hbAmplitude", 0.0, 2.0, 0.01, lp.hbAmplitude !== undefined ? lp.hbAmplitude : 0.35, false, 0.35);
                algoSpecificHTML += createSlider("Частота удару / Серцебиття (Beats Rate)", "hbBeatsFreq", 0.5, 50.0, 0.5, lp.hbBeatsFreq !== undefined ? lp.hbBeatsFreq : 4.0, false, 4.0);
                algoSpecificHTML += createSlider("Ширина / Гострота імпульсу (Pulse Width)", "hbPulseWidth", 0.01, 1.0, 0.01, lp.hbPulseWidth !== undefined ? lp.hbPulseWidth : 0.2, false, 0.2);
                algoSpecificHTML += createSlider("Нашарування хвилин / Шари (Harmonic Layers)", "hbLayers", 1, 8, 1, lp.hbLayers !== undefined ? lp.hbLayers : 2, false, 2);
                algoSpecificHTML += createSlider("Частота викривлення (Distortion Freq)", "hbDistortFreq", 0.0, 20.0, 0.1, lp.hbDistortFreq !== undefined ? lp.hbDistortFreq : 3.0, false, 3.0);
                algoSpecificHTML += createSlider("Амплітуда деформації шумів (Distortion Amp)", "hbDistortAmp", 0.0, 0.5, 0.005, lp.hbDistortAmp !== undefined ? lp.hbDistortAmp : 0.08, false, 0.08);
                algoSpecificHTML += createSlider("Розкид та хаотичність (Jitter)", "hbJitter", 0.0, 10.0, 0.05, lp.hbJitter !== undefined ? lp.hbJitter : 0.15, false, 0.15);
                algoSpecificHTML += createSlider("М'якість країв (Edge Softness)", "hbSoftness", 0.001, 0.05, 0.001, lp.hbSoftness !== undefined ? lp.hbSoftness : 0.005, false, 0.005);
            }

            if (lay.generatorType === 'spider_web') {
                algoSpecificHTML += `<div class="section-title">Spider Web (Павутина)</div>`;
                algoSpecificHTML += `<div class="property-group grid-2">
                    <label class="checkbox-label"><input type="checkbox" ${lp.enableRays !== false ? 'checked' : ''} onchange="upd('enableRays', this.checked)"> Увімкнути промені</label>
                    <label class="checkbox-label"><input type="checkbox" ${lp.enableRings !== false ? 'checked' : ''} onchange="upd('enableRings', this.checked)"> Увімкнути кільця</label>
                </div>`;
                algoSpecificHTML += createSlider("Кількість променів", "radialCount", 4, 64, 1, lp.radialCount || 18, false, 18);
                algoSpecificHTML += createSlider("Кількість кілець", "ringCount", 4, 64, 1, lp.ringCount || 22, false, 22);
                algoSpecificHTML += createSlider("Товщина кілець", "ringThick", 0.001, 0.5, 0.001, lp.ringThick !== undefined ? lp.ringThick : 0.04, false, 0.04);
                algoSpecificHTML += createSlider("Товщина променів", "radThick", 0.001, 0.5, 0.001, lp.radThick !== undefined ? lp.radThick : 0.025, false, 0.025);
                algoSpecificHTML += createSlider("Wobble (Хвилювання)", "wobble", 0, 0.5, 0.01, lp.wobble || 0.03, false, 0.03);
                algoSpecificHTML += createSlider("Jitter (Джиттер)", "jitter", 0, 20, 0.5, lp.jitter || 8, false, 8);
                algoSpecificHTML += createSlider("Fractal (Фрактал)", "fractal", 0, 1, 0.05, lp.fractal || 0, false, 0);
                algoSpecificHTML += createSlider("Хвиля кілець: Амплітуда", "ringSineAmp", 0, 0.5, 0.01, lp.ringSineAmp !== undefined ? lp.ringSineAmp : 0, false, 0);
                algoSpecificHTML += createSlider("Хвиля кілець: Частота", "ringSineFreq", 1, 30, 1, lp.ringSineFreq !== undefined ? lp.ringSineFreq : 5, false, 5);
                algoSpecificHTML += createSlider("Хвиля променів: Амплітуда", "radSineAmp", 0, 0.5, 0.01, lp.radSineAmp !== undefined ? lp.radSineAmp : 0, false, 0);
                algoSpecificHTML += createSlider("Хвиля променів: Частота", "radSineFreq", 1, 30, 1, lp.radSineFreq !== undefined ? lp.radSineFreq : 10, false, 10);
            }

            if (lay.generatorType === 'dots') {
                algoSpecificHTML += `<div class="section-title">Параметри точок (Dots Generator)</div>`;
                algoSpecificHTML += `<div class="property-group grid-2">
                    <div>
                        <label class="property-label">Тип сітки</label>
                        <select class="form-control" onchange="upd('dotGrid', this.value)">
                            <option value="square" ${(lp.dotGrid||'square')==='square'?'selected':''}>Квадратна сітка</option>
                            <option value="staggered" ${lp.dotGrid==='staggered'?'selected':''}>Шахматна (Зсув 50%)</option>
                        </select>
                    </div>
                    <div>
                        <label class="property-label">Форма</label>
                        <select class="form-control" onchange="upd('dotShape', this.value)">
                            <option value="circle" ${(lp.dotShape||'circle')==='circle'?'selected':''}>Коло (Circle)</option>
                            <option value="square" ${lp.dotShape==='square'?'selected':''}>Квадрат (Square)</option>
                            <option value="diamond" ${lp.dotShape==='diamond'?'selected':''}>Ромб (Diamond)</option>
                        </select>
                    </div>
                </div>`;
                algoSpecificHTML += createSlider("Розмір точок", "dotSize", 0.01, 0.5, 0.01, lp.dotSize !== undefined ? lp.dotSize : 0.25, false, 0.25);
                algoSpecificHTML += createSlider("М'якість країв", "dotSoftness", 0, 1, 0.01, lp.dotSoftness !== undefined ? lp.dotSoftness : 0.05, false, 0.05);
            }

            if (lay.generatorType === 'pixel_noise') {
                algoSpecificHTML += `<div class="section-title">Параметри піксельного шуму (Pixel Noise PRO)</div>`;
                algoSpecificHTML += createSlider("Проміжок між пікселями (Gap)", "pixelGap", 0, 0.5, 0.01, lp.pixelGap !== undefined ? lp.pixelGap : 0.0, false, 0.0);
                algoSpecificHTML += createSlider("Яскравість шва / проміжку", "pixelGapValue", 0, 1, 0.01, lp.pixelGapValue !== undefined ? lp.pixelGapValue : 0.0, false, 0.0);
                algoSpecificHTML += createSlider("М'якість країв шва", "pixelGapSoftness", 0, 1, 0.01, lp.pixelGapSoftness !== undefined ? lp.pixelGapSoftness : 0.0, false, 0.0);

                algoSpecificHTML += `<div class="property-group grid-2">
                    <div>
                        <label class="property-label">Тип сітки</label>
                        <select class="form-control" onchange="upd('pixelGridType', this.value)">
                            <option value="standard" ${(lp.pixelGridType||'standard')==='standard'?'selected':''}>Стандартна (Grid)</option>
                            <option value="staggered_h" ${lp.pixelGridType==='staggered_h'?'selected':''}>Горизонтальний зсув (Brick H)</option>
                            <option value="staggered_v" ${lp.pixelGridType==='staggered_v'?'selected':''}>Вертикальний зсув (Brick V)</option>
                        </select>
                    </div>
                    <div>
                        <label class="property-label">Форма блоків</label>
                        <select class="form-control" onchange="upd('pixelShape', this.value); renderProps();">
                            <option value="square" ${(lp.pixelShape||'square')==='square'?'selected':''}>Квадрат (Square)</option>
                            <option value="round" ${lp.pixelShape==='round'?'selected':''}>Скруглений (Round)</option>
                            <option value="circle" ${lp.pixelShape==='circle'?'selected':''}>Коло (Circle)</option>
                            <option value="diamond" ${lp.pixelShape==='diamond'?'selected':''}>Ромб (Diamond)</option>
                        </select>
                    </div>
                </div>`;

                if ((lp.pixelShape || 'square') === 'round') {
                    algoSpecificHTML += createSlider("Радіус скруглення кутів", "pixelCornerRadius", 0.01, 0.5, 0.01, lp.pixelCornerRadius !== undefined ? lp.pixelCornerRadius : 0.1, false, 0.1);
                }

                algoSpecificHTML += `<div class="property-group grid-2">
                    <div>
                        <label class="property-label">Розподіл шуму</label>
                        <select class="form-control" onchange="upd('pixelDistribution', this.value); renderProps();">
                            <option value="uniform" ${(lp.pixelDistribution||'uniform')==='uniform'?'selected':''}>Випадковий (Uniform)</option>
                            <option value="binary" ${lp.pixelDistribution==='binary'?'selected':''}>Бінарний (0 / 1)</option>
                            <option value="stepped" ${lp.pixelDistribution==='stepped'?'selected':''}>Східчастий (Levels)</option>
                            <option value="gaussian" ${lp.pixelDistribution==='gaussian'?'selected':''}>Гаусів (M'який)</option>
                            <option value="dither" ${lp.pixelDistribution==='dither'?'selected':''}>Шаховий Dither</option>
                        </select>
                    </div>
                    <div>
                        <label class="property-label">Псевдовипадковий Seed</label>
                        <div style="display:flex; gap:4px;">
                            <input type="number" class="form-control" min="0" max="9999" value="${lp.pixelSeed || 0}" onchange="upd('pixelSeed', parseInt(this.value)||0)" style="font-size:11px;">
                            <button type="button" class="btn btn-secondary" style="padding:2px 8px; font-size:11px;" onclick="upd('pixelSeed', Math.floor(Math.random()*9999)); renderProps();" title="Випадковий seed">🎲</button>
                        </div>
                    </div>
                </div>`;

                if (lp.pixelDistribution === 'binary') {
                    algoSpecificHTML += createSlider("Поріг бінарності (Threshold)", "pixelThreshold", 0, 1, 0.01, lp.pixelThreshold !== undefined ? lp.pixelThreshold : 0.5, false, 0.5);
                } else if (lp.pixelDistribution === 'stepped') {
                    algoSpecificHTML += createSlider("Кількість рівнів (Steps)", "pixelSteps", 2, 16, 1, lp.pixelSteps || 4, false, 4);
                }

                algoSpecificHTML += `<div class="property-group grid-2">
                    <div>
                        <label class="property-label">3D Фаска / Об'єм</label>
                        <select class="form-control" onchange="upd('pixelBevelType', this.value)">
                            <option value="pyramid" ${(lp.pixelBevelType||'pyramid')==='pyramid'?'selected':''}>Пірамідальна (Pyramid)</option>
                            <option value="soft" ${lp.pixelBevelType==='soft'?'selected':''}>Купол (Dome)</option>
                            <option value="inset" ${lp.pixelBevelType==='inset'?'selected':''}>Внутрішня тінь (Inset)</option>
                        </select>
                    </div>
                    <div>
                        <label class="property-label">Інтенсивність 3D фаски</label>
                        ${sliderRow(0, 1, 0.05, lp.pixelBevel !== undefined ? lp.pixelBevel : 0.0, 0.0, "upd('pixelBevel', parseFloat(this.value))")}
                    </div>
                </div>`;
            }

            if (lay.generatorType === 'gradient') {
                let sortedStops = lp.stops.slice().sort((a, b) => a.pos - b.pos);
                let cssStopsStr = sortedStops.map(s => `${s.color || '#888888'} ${Math.round(s.pos * 100)}%`).join(', ');
                let rampStyle = `background: linear-gradient(to right, ${cssStopsStr}); height: 28px; border-radius: 6px; border: 1px solid var(--border-color, #27272a); margin-bottom: 10px; position: relative; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);`;

                let stopsHTML = sortedStops.map((s) => {
                    let rawIdx = lp.stops.indexOf(s);
                    return `
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color, #27272a); border-radius: 6px; padding: 6px 8px; margin-bottom: 6px; display: grid; grid-template-columns: 28px 1fr 1fr 24px; gap: 6px; align-items: center;">
                        <input type="color" value="${s.color || '#ffffff'}" oninput="updateGradientStop(${rawIdx}, 'color', this.value)" onchange="scheduleHistorySnapshot();" style="width:24px; height:24px; padding:0; border:none; background:none; cursor:pointer;" title="Колір точки">
                        <div>
                            <div id="lbl_stop_pos_${rawIdx}" style="font-size:9px; color:var(--text-muted, #a1a1aa);">Поз: ${Math.round(s.pos * 100)}%</div>
                            <input type="range" min="0" max="1" step="0.01" value="${s.pos}" oninput="updateGradientStop(${rawIdx}, 'pos', this.value)" onchange="finishGradientStopEdit();" style="width:100%;">
                        </div>
                        <div>
                            <div id="lbl_stop_val_${rawIdx}" style="font-size:9px; color:var(--text-muted, #a1a1aa);">Вис: ${(s.val !== undefined ? s.val : s.pos).toFixed(2)}</div>
                            <input type="range" min="0" max="1" step="0.01" value="${s.val !== undefined ? s.val : s.pos}" oninput="updateGradientStop(${rawIdx}, 'val', this.value)" onchange="finishGradientStopEdit();" style="width:100%;">
                        </div>
                        <button type="button" class="reset-btn" style="color:#ef4444; font-size:12px;" title="Видалити точку" onclick="removeGradientStop(${rawIdx})" ${lp.stops.length <= 2 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>✕</button>
                    </div>`;
                }).join('');

                algoSpecificHTML += `
                <div class="section-title" style="margin-top:12px;">🎨 Градієнти (Procedural Gradients)</div>
                <div class="property-group">
                    <label class="property-label">Форма / Тип градієнта</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        <button onclick="upd('gradType','linear')" class="gen-btn ${lp.gradType==='linear'?'active':''}">Лінійний</button>
                        <button onclick="upd('gradType','radial')" class="gen-btn ${lp.gradType==='radial'?'active':''}">Радіальний</button>
                        <button onclick="upd('gradType','elliptical')" class="gen-btn ${lp.gradType==='elliptical'?'active':''}">Овальний</button>
                        <button onclick="upd('gradType','conical')" class="gen-btn ${lp.gradType==='conical'?'active':''}">Конічний</button>
                        <button onclick="upd('gradType','reflected')" class="gen-btn ${lp.gradType==='reflected'?'active':''}">Відбитий</button>
                        <button onclick="upd('gradType','diamond')" class="gen-btn ${lp.gradType==='diamond'?'active':''}">Ромбічний</button>
                    </div>
                </div>

                <div class="property-group">
                    <label class="property-label">Повторення (Spread Method)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        <button onclick="upd('spreadMethod','clamp')" class="gen-btn ${lp.spreadMethod==='clamp'?'active':''}">Clamp</button>
                        <button onclick="upd('spreadMethod','repeat')" class="gen-btn ${lp.spreadMethod==='repeat'?'active':''}">Repeat</button>
                        <button onclick="upd('spreadMethod','reflect')" class="gen-btn ${lp.spreadMethod==='reflect'?'active':''}">Reflect</button>
                    </div>
                </div>

                ${createSlider("Центр X (Position X)", "centerX", 0, 1, 0.01, lp.centerX, false, 0.5)}
                ${createSlider("Центр Y (Position Y)", "centerY", 0, 1, 0.01, lp.centerY, false, 0.5)}
                ${createSlider("Пропорції / Еліпсис", "aspectRatio", 0.1, 5, 0.05, lp.aspectRatio, false, 1.0)}
                ${createSlider("Середня точка (Midpoint)", "midpoint", 0.05, 0.95, 0.01, lp.midpoint, false, 0.5)}

                <div class="property-group" style="margin-top:12px;">
                    <label class="property-label">Пресети градієнта</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr); gap:4px;">
                        <button onclick="applyGradientPreset('bw')" class="gen-btn" style="font-size:10px;">Ч/Б (BW)</button>
                        <button onclick="applyGradientPreset('chrome')" class="gen-btn" style="font-size:10px;">Хром</button>
                        <button onclick="applyGradientPreset('gold')" class="gen-btn" style="font-size:10px;">Золото</button>
                        <button onclick="applyGradientPreset('sunset')" class="gen-btn" style="font-size:10px;">Захід</button>
                        <button onclick="applyGradientPreset('cyber')" class="gen-btn" style="font-size:10px;">Неон</button>
                        <button onclick="applyGradientPreset('rainbow')" class="gen-btn" style="font-size:10px;">Веселка</button>
                    </div>
                </div>

                <div class="property-group" style="margin-top:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span class="property-label" style="margin:0;">Шкала кольорів (Color Ramp)</span>
                        <button type="button" class="btn btn-primary" onclick="addGradientStop()" style="padding:2px 8px; font-size:10px;">+ Точка</button>
                    </div>
                    <div id="gradientRampPreview" style="${rampStyle}"></div>
                    ${stopsHTML}
                </div>
                `;
            }

            if (lay.generatorType === 'simplex') {
                let mode = lp.simplexMode || 'standard';
                let octaves = lp.octaves || 4;
                let lacunarity = lp.lacunarity !== undefined ? lp.lacunarity : 2.0;
                let gain = lp.gain !== undefined ? lp.gain : 0.5;
                let warpStr = lp.warpStrength || 0;
                let warpFreq = lp.warpFreq || 1.0;
                let ridgePower = lp.ridgePower !== undefined ? lp.ridgePower : 2.0;
                let seamless = lp.seamless === true;

                algoSpecificHTML += `
                <div class="section-title" style="margin-top:12px; font-weight:700; color:var(--primary-color, #3b82f6);">⚡ Simplex Noise Pro</div>

                <div class="property-group">
                    <label class="property-label">Режим шуму (Simplex Variant)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        <button type="button" onclick="upd('simplexMode','standard'); renderProps();" class="gen-btn ${mode === 'standard' ? 'active' : ''}">🌊 Стандартний (fBM)</button>
                        <button type="button" onclick="upd('simplexMode','ridged'); renderProps();" class="gen-btn ${mode === 'ridged' ? 'active' : ''}">⛰️ Хребти (Ridged)</button>
                        <button type="button" onclick="upd('simplexMode','billow'); renderProps();" class="gen-btn ${mode === 'billow' ? 'active' : ''}">☁️ Хмароподібний (Billow)</button>
                        <button type="button" onclick="upd('simplexMode','turbulence'); renderProps();" class="gen-btn ${mode === 'turbulence' ? 'active' : ''}">🌪️ Турбулентність</button>
                        <button type="button" onclick="upd('simplexMode','swiss'); renderProps();" class="gen-btn ${mode === 'swiss' ? 'active' : ''}">🧀 Швейцарський (Swiss)</button>
                    </div>
                </div>

                <div class="property-group" style="margin-bottom:8px;">
                    <label style="font-size:11px; cursor:pointer; display:flex; align-items:center; gap:6px;">
                        <input type="checkbox" ${seamless ? 'checked' : ''} onchange="upd('seamless', this.checked); renderProps();">
                        <span><strong>3D/4D Безшовне плиточне покриття (Seamless 4D)</strong></span>
                    </label>
                    <div style="font-size:10px; color:var(--text-muted, #a1a1aa); margin-top:2px; line-height:1.3;">
                        Створює 100% безшовну повторювану текстуру без швів через проекцію 4D гіпер-тора.
                    </div>
                </div>
                `;

                algoSpecificHTML += createSlider("Октави (Octaves)", "octaves", 1, 10, 1, octaves, false, 4);
                algoSpecificHTML += createSlider("Лакунарність (Lacunarity)", "lacunarity", 1.0, 4.0, 0.1, lacunarity, false, 2.0);
                algoSpecificHTML += createSlider("Загасання / Амплітуда (Gain)", "gain", 0.1, 0.9, 0.05, gain, false, 0.5);

                if (mode === 'ridged' || mode === 'swiss') {
                    algoSpecificHTML += createSlider("Загострення хребтів (Ridge Power)", "ridgePower", 0.5, 4.0, 0.1, ridgePower, false, 2.0);
                }

                algoSpecificHTML += createSlider("Деформація домену (Domain Warping)", "warpStrength", 0.0, 2.0, 0.05, warpStr, false, 0);
                if (warpStr > 0) {
                    algoSpecificHTML += createSlider("Частота деформації (Warp Freq)", "warpFreq", 0.1, 5.0, 0.1, warpFreq, false, 1.0);
                }
            }

            if (['perlin', 'spiral'].includes(lay.generatorType)) {
                algoSpecificHTML += createSlider(lay.generatorType === 'spiral' ? 'Кількість рукавів (Arms)' : 'Октави', "octaves", 1, 10, 1, lp.octaves || 3, false, 3);
            }
            if (lay.generatorType === 'fbm') {
                algoSpecificHTML += createSlider("Октави (Octaves)", "octaves", 1, 10, 1, lp.octaves || 3, false, 3);
                algoSpecificHTML += createSlider("Лакунарність (Lacunarity)", "lacunarity", 1.1, 4.0, 0.1, lp.lacunarity !== undefined ? lp.lacunarity : 2.0, false, 2.0);
                algoSpecificHTML += createSlider("Амплітуда (Gain)", "gain", 0.1, 0.9, 0.05, lp.gain !== undefined ? lp.gain : 0.5, false, 0.5);
            }
            if (lay.generatorType === 'ridged') {
                let mode = lp.ridgeMode || 'ridges';
                let noiseType = lp.ridgeNoiseType || 'perlin';
                let isMulti = lp.ridgeMultifractal !== false;

                algoSpecificHTML += `
                <div class="section-title" style="margin-top:12px; font-weight:700; color:var(--primary-color, #3b82f6);">⛰️ Ridged Multifractal (Гірські Хребти)</div>

                <div class="property-group">
                    <label class="property-label">Режим Хребтів (Ridge Mode)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        <button type="button" onclick="upd('ridgeMode','ridges'); renderProps();" class="gen-btn ${mode === 'ridges' ? 'active' : ''}">⛰️ Шпилі (Peaks)</button>
                        <button type="button" onclick="upd('ridgeMode','valleys'); renderProps();" class="gen-btn ${mode === 'valleys' ? 'active' : ''}">🏜️ Яри (Ravines)</button>
                        <button type="button" onclick="upd('ridgeMode','dual'); renderProps();" class="gen-btn ${mode === 'dual' ? 'active' : ''}">⚡ Подвійні жили (Dual)</button>
                        <button type="button" onclick="upd('ridgeMode','sharp_valley'); renderProps();" class="gen-btn ${mode === 'sharp_valley' ? 'active' : ''}">🔪 Гострі долини</button>
                    </div>
                </div>

                <div class="property-group">
                    <label class="property-label">Базовий шум (Noise Function)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        <button type="button" onclick="upd('ridgeNoiseType','perlin'); renderProps();" class="gen-btn ${noiseType === 'perlin' ? 'active' : ''}">Perlin</button>
                        <button type="button" onclick="upd('ridgeNoiseType','simplex'); renderProps();" class="gen-btn ${noiseType === 'simplex' ? 'active' : ''}">Simplex</button>
                        <button type="button" onclick="upd('ridgeNoiseType','value'); renderProps();" class="gen-btn ${noiseType === 'value' ? 'active' : ''}">Value Cubic</button>
                        <button type="button" onclick="upd('ridgeNoiseType','cellular'); renderProps();" class="gen-btn ${noiseType === 'cellular' ? 'active' : ''}">Cellular / Voronoi</button>
                    </div>
                </div>

                <div class="property-group" style="margin-bottom:8px;">
                    <label style="font-size:11px; cursor:pointer; display:flex; align-items:center; gap:6px;">
                        <input type="checkbox" ${isMulti ? 'checked' : ''} onchange="upd('ridgeMultifractal', this.checked); renderProps();">
                        <span><strong>Мультифрактальний зв'язок (Multifractal Coupling)</strong></span>
                    </label>
                    <div style="font-size:10px; color:var(--text-muted, #a1a1aa); margin-top:2px; line-height:1.3;">
                        Зв'язок октав: деталі формуються переважно на піках хребтів (Musgrave Multifractal)
                    </div>
                </div>
                `;

                algoSpecificHTML += createSlider("Октави (Octaves)", "octaves", 1, 10, 1, lp.octaves || 3, false, 3);
                algoSpecificHTML += createSlider("Гострота хребтів (Power / Exp)", "ridgePower", 0.2, 5.0, 0.1, lp.ridgePower !== undefined ? lp.ridgePower : 2.0, false, 2.0);
                algoSpecificHTML += createSlider("Зсув / Ширина хребта (Offset)", "ridgeOffset", 0.1, 2.0, 0.05, lp.ridgeOffset !== undefined ? lp.ridgeOffset : 1.0, false, 1.0);
                if (isMulti) {
                    algoSpecificHTML += createSlider("Загасання / Зв'язок (Attenuation)", "ridgeAttenuation", 0.0, 4.0, 0.1, lp.ridgeAttenuation !== undefined ? lp.ridgeAttenuation : 2.0, false, 2.0);
                }
                algoSpecificHTML += createSlider("Лакунарність (Lacunarity)", "lacunarity", 1.1, 4.0, 0.1, lp.lacunarity !== undefined ? lp.lacunarity : 2.0, false, 2.0);
                algoSpecificHTML += createSlider("Амплітуда (Gain)", "gain", 0.1, 0.9, 0.05, lp.gain !== undefined ? lp.gain : 0.5, false, 0.5);
                algoSpecificHTML += createSlider("Викривлення домену (Warping)", "ridgeWarp", 0.0, 2.0, 0.05, lp.ridgeWarp || 0, false, 0);
                if ((lp.ridgeWarp || 0) > 0) {
                    algoSpecificHTML += createSlider("Частота викривлення", "ridgeWarpFreq", 0.5, 10.0, 0.5, lp.ridgeWarpFreq || 2.0, false, 2.0);
                }
            }
            if(lay.generatorType==='voronoi') algoSpecificHTML+=`<div class="property-group grid-2"><div><label class="property-label">Метрика</label><select class="form-control" onchange="upd('metric',this.value)"><option value="euclidean" ${lp.metric==='euclidean'?'selected':''}>Euclidean</option><option value="manhattan" ${lp.metric==='manhattan'?'selected':''}>Manhattan</option><option value="chebyshev" ${lp.metric==='chebyshev'?'selected':''}>Chebyshev</option></select></div><div><label class="property-label">Режим</label><select class="form-control" onchange="upd('mode',this.value)"><option value="f1" ${lp.mode==='f1'?'selected':''}>F1</option><option value="f2" ${lp.mode==='f2'?'selected':''}>F2</option><option value="f2_minus_f1" ${lp.mode==='f2_minus_f1'?'selected':''}>F2-F1</option></select></div></div>`;
            if (lay.generatorType === 'sine') {
                algoSpecificHTML += `
                <div class="section-title">Параметри синусоїди (Sine Waves PRO)</div>
                <div class="property-group">
                    <label class="property-label">Режим паттерну</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        <button onclick="upd('sineMode','cross_add')" class="gen-btn ${(lp.sineMode||'cross_add')==='cross_add'?'active':''}">Сітка (Сума)</button>
                        <button onclick="upd('sineMode','grid_mult')" class="gen-btn ${lp.sineMode==='grid_mult'?'active':''}">Точки (Множення)</button>
                        <button onclick="upd('sineMode','horizontal')" class="gen-btn ${lp.sineMode==='horizontal'?'active':''}">Горизонтальний</button>
                        <button onclick="upd('sineMode','vertical')" class="gen-btn ${lp.sineMode==='vertical'?'active':''}">Вертикальний</button>
                        <button onclick="upd('sineMode','diagonal')" class="gen-btn ${lp.sineMode==='diagonal'?'active':''}">Діагональний</button>
                        <button onclick="upd('sineMode','radial')" class="gen-btn ${lp.sineMode==='radial'?'active':''}">Концентричний</button>
                        <button onclick="upd('sineMode','hex')" class="gen-btn ${lp.sineMode==='hex'?'active':''}">Гексагональний</button>
                        <button onclick="upd('sineMode','cross_max')" class="gen-btn ${lp.sineMode==='cross_max'?'active':''}">Max (Коробка)</button>
                        <button onclick="upd('sineMode','cross_diff')" class="gen-btn ${lp.sineMode==='cross_diff'?'active':''}">Diff (Ромби)</button>
                    </div>
                </div>

                <div class="property-group">
                    <label class="property-label">Форма хвилі (Profile)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        <button onclick="upd('sineProfile','sine')" class="gen-btn ${(lp.sineProfile||'sine')==='sine'?'active':''}">Синус</button>
                        <button onclick="upd('sineProfile','cosine')" class="gen-btn ${lp.sineProfile==='cosine'?'active':''}">Косинус</button>
                        <button onclick="upd('sineProfile','triangle')" class="gen-btn ${lp.sineProfile==='triangle'?'active':''}">Трикутник</button>
                        <button onclick="upd('sineProfile','square')" class="gen-btn ${lp.sineProfile==='square'?'active':''}">Прямокутник</button>
                        <button onclick="upd('sineProfile','absolute')" class="gen-btn ${lp.sineProfile==='absolute'?'active':''}">Арки (|Sin|)</button>
                        <button onclick="upd('sineProfile','sawtooth')" class="gen-btn ${lp.sineProfile==='sawtooth'?'active':''}">Пила</button>
                    </div>
                </div>
                `;

                algoSpecificHTML += createSlider("Кут повороту хвилі", "sineAngle", -180, 180, 1, lp.sineAngle || 0, false, 0);
                algoSpecificHTML += createSlider("Глобальна фаза (Phase)", "phase", 0, 6.28, 0.05, lp.phase || 0, false, 0);
                algoSpecificHTML += createSlider("Зсув фази X (°)", "sinePhaseX", 0, 360, 1, lp.sinePhaseX || 0, false, 0);
                algoSpecificHTML += createSlider("Зсув фази Y (°)", "sinePhaseY", 0, 360, 1, lp.sinePhaseY || 0, false, 0);

                algoSpecificHTML += createSlider("Гострота / Потужність (Exp)", "sineSharpness", 0.1, 5.0, 0.1, lp.sineSharpness !== undefined ? lp.sineSharpness : 1.0, false, 1.0);
                algoSpecificHTML += createSlider("Ширина імпульсу (Duty)", "sineDuty", 0.05, 0.95, 0.01, lp.sineDuty !== undefined ? lp.sineDuty : 0.5, false, 0.5);

                algoSpecificHTML += createSlider("Гармоніки / Октави", "sineOctaves", 1, 8, 1, lp.sineOctaves || 1, false, 1);
                algoSpecificHTML += createSlider("Спад гармонік (Gain)", "sineGain", 0.1, 0.9, 0.05, lp.sineGain !== undefined ? lp.sineGain : 0.5, false, 0.5);

                algoSpecificHTML += createSlider("Викривлення / Wobble", "sineWobble", 0, 2.0, 0.05, lp.sineWobble || 0, false, 0);
                algoSpecificHTML += createSlider("Частота викривлення", "sineWobbleFreq", 0.5, 20.0, 0.5, lp.sineWobbleFreq || 5.0, false, 5.0);

                if ((lp.sineMode || 'cross_add') === 'radial') {
                    algoSpecificHTML += createSlider("Центр X (Position X)", "centerX", 0, 1, 0.01, lp.centerX !== undefined ? lp.centerX : 0.5, false, 0.5);
                    algoSpecificHTML += createSlider("Центр Y (Position Y)", "centerY", 0, 1, 0.01, lp.centerY !== undefined ? lp.centerY : 0.5, false, 0.5);
                }
            }

            if (lay.generatorType === 'matrix_digits') {
                algoSpecificHTML += `
                <div class="section-title">📟 Матриця цифр та слів (Matrix Code & Word Rain)</div>
                <div class="property-group grid-2">
                    <div>
                        <label class="property-label">Набір символів</label>
                        <select class="form-control" onchange="upd('matrixCharSet', this.value); renderProps();">
                            <option value="binary" ${(lp.matrixCharSet||'binary')==='binary'?'selected':''}>0 та 1 (Бінарний / Binary)</option>
                            <option value="digits" ${lp.matrixCharSet==='digits'?'selected':''}>0 - 9 (Десятичні цифри)</option>
                            <option value="hex" ${lp.matrixCharSet==='hex'?'selected':''}>0 - F (16-річні Hex)</option>
                            <option value="matrix_kanji" ${lp.matrixCharSet==='matrix_kanji'?'selected':''}>Цифри та Символи (*+#=?!)</option>
                            <option value="custom" ${lp.matrixCharSet==='custom'?'selected':''}>Власний рядок / Слово (Custom Word)</option>
                        </select>
                    </div>
                    <div>
                        <label class="property-label">Стиль шрифту</label>
                        <select class="form-control" onchange="upd('matrixDigitStyle', this.value)">
                            <option value="pixel_5x7" ${(lp.matrixDigitStyle||'pixel_5x7')==='pixel_5x7'?'selected':''}>👾 Піксельний 5x7</option>
                            <option value="pixel_3x5" ${lp.matrixDigitStyle==='pixel_3x5'?'selected':''}>🕹️ Міні-піксель 3x5</option>
                            <option value="digital_7seg" ${lp.matrixDigitStyle==='digital_7seg'?'selected':''}>⏰ 7-Сегментний LED</option>
                        </select>
                    </div>
                </div>`;

                if (lp.matrixCharSet === 'custom') {
                    algoSpecificHTML += `<div class="property-group grid-2">
                        <div>
                            <label class="property-label">Власні букви / слово (напр. love)</label>
                            <input type="text" class="form-control" value="${lp.matrixCustomChars !== undefined ? lp.matrixCustomChars : 'love'}" oninput="upd('matrixCustomChars', this.value)" style="font-size:12px; padding:4px 8px;">
                        </div>
                        <div>
                            <label class="property-label">Порядок букв / слів</label>
                            <select class="form-control" onchange="upd('matrixWordMode', this.value)">
                                <option value="sequence" ${(lp.matrixWordMode||'sequence')==='sequence'?'selected':''}>🔤 Послідовне слово</option>
                                <option value="random" ${lp.matrixWordMode==='random'?'selected':''}>🎲 Випадковий порядок</option>
                            </select>
                        </div>
                    </div>`;
                }

                algoSpecificHTML += createSlider("Каскадність / Довжина хвоста (Cascade Length)", "matrixCascade", 0, 40, 1, lp.matrixCascade !== undefined ? lp.matrixCascade : 12, false, 12);
                algoSpecificHTML += createSlider("Розтяжка тону / Спад (Tone Gradient Falloff)", "matrixCascadeFade", 0.1, 3.0, 0.1, lp.matrixCascadeFade !== undefined ? lp.matrixCascadeFade : 1.0, false, 1.0);

                algoSpecificHTML += createSlider("Густота / Заповнення (Density)", "matrixDensity", 0.05, 1.0, 0.01, lp.matrixDensity !== undefined ? lp.matrixDensity : 0.75, false, 0.75);
                algoSpecificHTML += createSlider("Шум хмарності (Cloud Noise Mask)", "matrixCloudNoise", 0.0, 1.0, 0.05, lp.matrixCloudNoise !== undefined ? lp.matrixCloudNoise : 0.5, false, 0.5);
                if ((lp.matrixCloudNoise || 0) > 0) {
                    algoSpecificHTML += createSlider("Масштаб хмар цифр (Cloud Scale)", "matrixCloudFreq", 0.5, 15.0, 0.5, lp.matrixCloudFreq !== undefined ? lp.matrixCloudFreq : 3.0, false, 3.0);
                }

                algoSpecificHTML += `<div class="property-group grid-2">
                    <div>
                        <label class="property-label">Напрямок розтяжки / каскаду</label>
                        <select class="form-control" onchange="upd('matrixDirection', this.value)">
                            <option value="top_down" ${(lp.matrixDirection||'top_down')==='top_down'?'selected':''}>⬇️ Згори вниз (Top to Bottom)</option>
                            <option value="bottom_up" ${lp.matrixDirection==='bottom_up'?'selected':''}>⬆️ Знизу вгору (Bottom to Top)</option>
                            <option value="left_right" ${lp.matrixDirection==='left_right'?'selected':''}>➡️ Зліва направо (Left to Right)</option>
                            <option value="right_left" ${lp.matrixDirection==='right_left'?'selected':''}>⬅️ Зправа наліво (Right to Left)</option>
                        </select>
                    </div>
                    <div>
                        <label class="property-label">Тип сітки (Grid Layout)</label>
                        <select class="form-control" onchange="upd('matrixGridType', this.value)">
                            <option value="standard" ${(lp.matrixGridType||'standard')==='standard'?'selected':''}>Стандартна сітка</option>
                            <option value="staggered_h" ${lp.matrixGridType==='staggered_h'?'selected':''}>Шахматна H (Brick)</option>
                            <option value="staggered_v" ${lp.matrixGridType==='staggered_v'?'selected':''}>Шахматна V</option>
                        </select>
                    </div>
                </div>
                <div class="property-group grid-2">
                    <div>
                        <label class="property-label">Псевдовипадковий Seed</label>
                        <div style="display:flex; gap:4px;">
                            <input type="number" class="form-control" min="0" max="9999" value="${lp.matrixSeed || 0}" onchange="upd('matrixSeed', parseInt(this.value)||0)" style="font-size:11px;">
                            <button type="button" class="btn btn-secondary" style="padding:2px 8px; font-size:11px;" onclick="upd('matrixSeed', Math.floor(Math.random()*9999)); renderProps();" title="Випадковий seed">🎲</button>
                        </div>
                    </div>
                </div>`;

                algoSpecificHTML += createSlider("Обертання символів (Char Rotation)", "matrixCharAngle", -180, 180, 5, lp.matrixCharAngle || 0, false, 0);
                algoSpecificHTML += createSlider("Випадковий розкид кута (Rotation Randomness)", "matrixCharAngleJitter", 0, 180, 5, lp.matrixCharAngleJitter || 0, false, 0);

                algoSpecificHTML += createSlider("Масштаб цифр та клітинки (Digit & Grid Scale)", "matrixDigitScale", 0.1, 4.0, 0.05, lp.matrixDigitScale !== undefined ? lp.matrixDigitScale : 1.0, false, 1.0);
                algoSpecificHTML += createSlider("Проміжок між цифрами (Spacing)", "matrixSpacing", 0.0, 0.8, 0.01, lp.matrixSpacing !== undefined ? lp.matrixSpacing : 0.0, false, 0.0);
                algoSpecificHTML += createSlider("Світіння та німб (Glow Halo)", "matrixGlow", 0.0, 3.0, 0.05, lp.matrixGlow !== undefined ? lp.matrixGlow : 0.2, false, 0.2);
                algoSpecificHTML += createSlider("Спалахи головних цифр (Head Glow)", "matrixHeadGlow", 0.0, 3.0, 0.05, lp.matrixHeadGlow !== undefined ? lp.matrixHeadGlow : 0.3, false, 0.3);
                algoSpecificHTML += createSlider("Хаотичність яскравості (Jitter)", "matrixJitter", 0.0, 3.0, 0.05, lp.matrixJitter !== undefined ? lp.matrixJitter : 0.15, false, 0.15);
                algoSpecificHTML += createSlider("Зсув дощу / Колонок (Rain Speed)", "matrixRainSpeed", 0.0, 10.0, 0.1, lp.matrixRainSpeed !== undefined ? lp.matrixRainSpeed : 0.0, false, 0.0);
            }

            const algoLabels = {
                'gradient': 'Градієнт (Gradient)',
                'paint': 'Малювання (Paint Canvas)',
                'simplex': 'Simplex Noise',
                'perlin': 'Perlin Noise',
                'voronoi': 'Вороной (Voronoi)',
                'fbm': 'FBM (Fractal Brownian Motion)',
                'ridged': 'Ridged Multifractal',
                'sine': 'Синусоїда (Sine Waves)',
                'radial': 'Радіальний (Radial Waves)',
                'spiral': 'Спіраль (Spiral)',
                'hexagon': 'Шестикутники (Hexagon Grid)',
                'pixel_noise': 'Піксельний шум (Pixel Noise)',
                'white_noise': 'Білий шум (White Noise)',
                'checkerboard': 'Шахматка (Checkerboard)',
                'dots': 'Точки / Сітка (Dots)',
                'weave': 'Плетіння (Weave Pattern)',
                'value_noise': 'Value Noise',
                'cellular': 'Клітинний шум (Cellular)',
                'spider_web': 'Павутина (Spider Web)',
                'cymatics': 'Кіматика (Cymatics)',
                'heartbeat': '💓 Серцебиття та ЕКГ (Heartbeat Lines)',
                'matrix_digits': '📟 Матриця цифр (Matrix Rain & Digits Cloud)'
            };

            const algoOptions = Object.keys(algoLabels).map(t => 
                `<option value="${t}" ${lay.generatorType === t ? 'selected' : ''}>${algoLabels[t]}</option>`
            ).join('');

            layerBlockContents.algo = `
                <div class="property-group" style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <label class="property-label" style="margin:0;">Алгоритм</label>
                        <button onclick="randomizeAlgorithm(state.layers.findIndex(l=>l.id==='${lay.id}'))" class="btn btn-secondary" style="padding:3px 8px; font-size:11px;" title="Рандомізувати параметри алгоритму (сід, масштаб, зсув тощо)">🎲 Рандом алгоритм</button>
                    </div>
                    <select class="form-control" onchange="upd('generatorType', this.value, false); renderProps();" style="width:100%; height:32px; font-size:12px; font-weight:600;">
                        ${algoOptions}
                    </select>
                </div>
                ${algoSpecificHTML}
            `;

            // Block: transform
            layerBlockContents.transform = `
                ${renderWarpOrderToggle(lp.warpOrder, "updWarpOrder", false)}
                ${createSlider("Зсув X", "offsetX", -2, 2, 0.05, lp.offsetX, false, 0)}
                ${createSlider("Зсув Y", "offsetY", -2, 2, 0.05, lp.offsetY, false, 0)}
                <div class="property-group"><label class="property-label">Масштаб по осях <button type="button" class="layer-btn" title="${lp.lockScale?'Масштаб X/Y пов’язаний':'Масштаб X/Y незалежний'}" onclick="upd('lockScale',${!lp.lockScale}); renderProps();">${lp.lockScale?'🔒':'🔓'}</button></label></div>
                ${createScaleSlider("Масштаб X (Noise/Web)", "scaleX", lp.scaleX)}
                ${createScaleSlider("Масштаб Y (Noise/Web)", "scaleY", lp.scaleY)}
                ${createSlider("Масштаб Шару (Zoom)", "layerScale", 0.1, 10, 0.1, lp.layerScale, false, 1)}
                ${createSlider("Кут обертання (−180° … +180°)", "angle", -180, 180, 1, lp.angle, false, 0)}
                ${createSlider("Перспектива вертикальна", "perspectiveV", -500, 500, 1, lp.perspectiveV || 0, false, 0)}
                ${createSlider("Перспектива горизонтальна", "perspectiveH", -500, 500, 1, lp.perspectiveH || 0, false, 0)}
            `;

            // Block: fx
            let isBlendIfExpanded = lp.blendIfExpanded !== undefined ? lp.blendIfExpanded : false;

            let blendIfCardHTML = `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color, #27272a); border-radius: 8px; margin: 10px 0; overflow:hidden;">
                <div onclick="toggleBlendIfExpand()" style="display:flex; justify-content:space-between; align-items:center; padding: 10px 12px; cursor:pointer; user-select:none; background: rgba(255,255,255,0.02);" title="Натисніть для розгортання/згортання налаштувань Blend If">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <input type="checkbox" ${lp.useBlendIf ? 'checked' : ''} onclick="event.stopPropagation();" onchange="toggleBlendIfActive(this.checked);" style="cursor:pointer; width:15px; height:15px; accent-color: var(--primary-color, #3b82f6);">
                        <span style="font-weight:700; color:${lp.useBlendIf ? 'var(--primary-color, #3b82f6)' : 'var(--text-color)'}; font-size:12px;">🎚️ Blend If (Накласти якщо)</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        ${lp.useBlendIf ? '<span style="font-size:9px; background:rgba(59,130,246,0.2); color:#3b82f6; padding:2px 6px; border-radius:4px; font-weight:700; letter-spacing:0.03em;">АКТИВНО</span>' : ''}
                        <span class="accordion-chevron ${isBlendIfExpanded ? 'open' : ''}" style="font-size:10px; color:var(--text-muted); transition:transform 0.2s; display:inline-block;">▼</span>
                    </div>
                </div>
                ${isBlendIfExpanded ? `
                    <div style="padding: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
                        <div class="property-group" style="margin-bottom:8px;">
                            <label class="property-label" style="font-size:10px;">Канал порівняння</label>
                            <div class="gen-grid" style="grid-template-columns:repeat(4,1fr);">
                                <button type="button" onclick="upd('blendIfChannel','gray'); renderProps();" class="gen-btn ${(lp.blendIfChannel||'gray')==='gray'?'active':''}">Сірий</button>
                                <button type="button" onclick="upd('blendIfChannel','red'); renderProps();" class="gen-btn ${lp.blendIfChannel==='red'?'active':''}" style="${lp.blendIfChannel==='red'?'color:#ef4444;font-weight:700;':''}">R</button>
                                <button type="button" onclick="upd('blendIfChannel','green'); renderProps();" class="gen-btn ${lp.blendIfChannel==='green'?'active':''}" style="${lp.blendIfChannel==='green'?'color:#22c55e;font-weight:700;':''}">G</button>
                                <button type="button" onclick="upd('blendIfChannel','blue'); renderProps();" class="gen-btn ${lp.blendIfChannel==='blue'?'active':''}" style="${lp.blendIfChannel==='blue'?'color:#3b82f6;font-weight:700;':''}">B</button>
                            </div>
                        </div>

                        <!-- This Layer Section -->
                        <div style="background:rgba(0,0,0,0.25); padding:8px; border-radius:6px; margin-bottom:8px; border:1px solid rgba(255,255,255,0.06);">
                            <div style="font-size:11px; font-weight:700; color:#f4f4f5; margin-bottom:2px;">🔹 Цей шар (This Layer)</div>
                            <div style="font-size:9.5px; color:var(--text-muted); margin-bottom:6px;">Приховує темні/світлі зони даного шару</div>
                            
                            ${blendIfRow("Тіні (Blacks)", "blendIfThisBlack1", "blendIfThisBlack2", lp.blendIfThisBlack1||0, lp.blendIfThisBlack2||0)}
                            ${blendIfRow("Світла (Whites)", "blendIfThisWhite1", "blendIfThisWhite2", lp.blendIfThisWhite1!==undefined?lp.blendIfThisWhite1:100, lp.blendIfThisWhite2!==undefined?lp.blendIfThisWhite2:100)}
                            ${renderBlendIfRampPreview(lp.blendIfThisBlack1||0, lp.blendIfThisBlack2||0, lp.blendIfThisWhite1!==undefined?lp.blendIfThisWhite1:100, lp.blendIfThisWhite2!==undefined?lp.blendIfThisWhite2:100, 'ramp_this')}
                        </div>

                        <!-- Underlying Layer Section -->
                        <div style="background:rgba(0,0,0,0.25); padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
                            <div style="font-size:11px; font-weight:700; color:#f4f4f5; margin-bottom:2px;">🔸 Нижній шар (Underlying Layer)</div>
                            <div style="font-size:9.5px; color:var(--text-muted); margin-bottom:6px;">Проявляє темні/світлі зони фону крізь цей шар</div>

                            ${blendIfRow("Тіні (Blacks)", "blendIfUnderBlack1", "blendIfUnderBlack2", lp.blendIfUnderBlack1||0, lp.blendIfUnderBlack2||0)}
                            ${blendIfRow("Світла (Whites)", "blendIfUnderWhite1", "blendIfUnderWhite2", lp.blendIfUnderWhite1!==undefined?lp.blendIfUnderWhite1:100, lp.blendIfUnderWhite2!==undefined?lp.blendIfUnderWhite2:100)}
                            ${renderBlendIfRampPreview(lp.blendIfUnderBlack1||0, lp.blendIfUnderBlack2||0, lp.blendIfUnderWhite1!==undefined?lp.blendIfUnderWhite1:100, lp.blendIfUnderWhite2!==undefined?lp.blendIfUnderWhite2:100, 'ramp_under')}
                        </div>
                    </div>
                ` : ''}
            </div>`;

            layerBlockContents.fx = `
                ${blendIfCardHTML}
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.useThreshold?'checked':''} onchange="upd('useThreshold',this.checked)"> Threshold (Поріг)</label>
                    ${lp.useThreshold ? sliderRow(0, 100, 1, lp.thresholdVal||50, 50, "upd('thresholdVal',this.value)") : ''}
                </div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.useLevels?'checked':''} onchange="upd('useLevels',this.checked)"> Levels (Рівні)</label>
                    ${lp.useLevels ? `<div style="display:flex;gap:4px;margin-bottom:4px;align-items:center;"><span style="color:#a1a1aa;font-size:10px;width:30px;">Min</span>${sliderRow(0, 100, 1, lp.levelMin||0, 0, "upd('levelMin',this.value)")}</div><div style="display:flex;gap:4px;align-items:center;"><span style="color:#a1a1aa;font-size:10px;width:30px;">Max</span>${sliderRow(0, 100, 1, lp.levelMax||100, 100, "upd('levelMax',this.value)")}</div>`:''}
                </div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.usePosterize?'checked':''} onchange="upd('usePosterize',this.checked)"> Постеризація (Quantization)</label>
                    ${lp.usePosterize ? sliderRow(2, 16, 1, lp.posterizeLevels||4, 4, "upd('posterizeLevels',this.value)") : ''}
                </div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.useFindEdges?'checked':''} onchange="upd('useFindEdges',this.checked)"> Find Edges (Знайти краї)</label>
                </div>
                <div class="property-group">
                    <label class="property-label"><input type="checkbox" ${lp.invert?'checked':''} onchange="upd('invert',this.checked)"> Інверсія кольорів (Invert)</label>
                </div>
                ${createSlider("Яскравість шару", "brightness", 0, 2, 0.05, lp.brightness, false, 1)}
                ${createSlider("Контраст шару", "contrast", 0.1, 3, 0.05, lp.contrast, false, 1)}
                ${createSlider("Розмиття (px)", "blur", 0, 100, 1, lp.blur||0, false, 0)}
                <div class="property-group" style="margin-top:-6px;">
                    <label class="property-label" style="font-size:11px; margin-bottom:4px;">Тип розмиття</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        <button onclick="upd('blurType','gaussian')" class="gen-btn ${(lp.blurType||'gaussian')==='gaussian'?'active':''}">Гаус (Gaussian)</button>
                        <button onclick="upd('blurType','box')" class="gen-btn ${lp.blurType==='box'?'active':''}">Бокс (Box)</button>
                    </div>
                </div>
                <div class="property-group" style="margin-top:-6px;">
                    <label class="checkbox-label" style="font-size:11px; display:flex; align-items:center; gap:6px;">
                        <input type="checkbox" ${lp.blurClampEdge ? 'checked' : ''} onchange="upd('blurClampEdge', this.checked)">
                        <span>Repeat Edge Pixels / Clamp to Edge</span>
                    </label>
                </div>
            `;

            // Block: warps
            let warpsHTML = lp.warps.map((w, idx) => renderWarpCardHTML(w, idx, false)).join('');

            // Block: color
            let colorMode = lp.colorMode || (lay.generatorType === 'gradient' && lp.stops ? 'color_ramp' : 'grayscale');
            let colorRampPreview = '';
            let sortedLayerStops = (lp.colorStops && lp.colorStops.length > 0) ? lp.colorStops.slice().sort((a,b) => a.pos - b.pos) : (lp.stops || []).slice().sort((a,b) => a.pos - b.pos);
            if (sortedLayerStops.length > 0) {
                let cssStopsStr = sortedLayerStops.map(s => `${s.color || '#888888'} ${Math.round(s.pos * 100)}%`).join(', ');
                colorRampPreview = `background: linear-gradient(to right, ${cssStopsStr}); height: 24px; border-radius: 6px; border: 1px solid var(--border-color, #27272a); margin-bottom: 8px; position: relative; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);`;
            } else {
                colorRampPreview = `background: linear-gradient(to right, #000000 0%, #ffffff 100%); height: 24px; border-radius: 6px; border: 1px solid var(--border-color, #27272a); margin-bottom: 8px;`;
            }

            let colorStopsHTML = '';
            if (colorMode === 'color_ramp') {
                colorStopsHTML = sortedLayerStops.map((s, sIdx) => {
                    return `
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color, #27272a); border-radius: 6px; padding: 4px 6px; margin-bottom: 4px; display: grid; grid-template-columns: 24px 1fr 20px; gap: 6px; align-items: center;">
                        <input type="color" value="${s.color || '#ffffff'}" oninput="updateColorRampStop(${sIdx}, 'color', this.value)" onchange="scheduleHistorySnapshot();" style="width:22px; height:22px; padding:0; border:none; background:none; cursor:pointer;" title="Колір точки">
                        <div>
                            <div style="font-size:9px; color:var(--text-muted, #a1a1aa);">Позиція: ${Math.round(s.pos * 100)}%</div>
                            <input type="range" min="0" max="1" step="0.01" value="${s.pos}" oninput="updateColorRampStop(${sIdx}, 'pos', this.value)" style="width:100%;">
                        </div>
                        <button type="button" class="reset-btn" style="color:#ef4444; font-size:12px;" title="Видалити точку" onclick="removeColorRampStop(${sIdx})" ${sortedLayerStops.length <= 2 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>✕</button>
                    </div>`;
                }).join('');
            }

            layerBlockContents.color = `
                <div class="property-group">
                    <label class="property-label">Режим кольору шару (Color Mode)</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(3,1fr);">
                        <button onclick="upd('colorMode','grayscale'); renderProps();" class="gen-btn ${colorMode==='grayscale'?'active':''}">Монохром</button>
                        <button onclick="upd('colorMode','tint'); renderProps();" class="gen-btn ${colorMode==='tint'?'active':''}">Дуотон (Tint)</button>
                        <button onclick="upd('colorMode','color_ramp'); renderProps();" class="gen-btn ${colorMode==='color_ramp'?'active':''}">Рампа (Ramp)</button>
                    </div>
                </div>

                ${colorMode === 'tint' ? `
                    <div class="property-group grid-2" style="margin-top:6px;">
                        <div>
                            <label class="property-label">Колір A (Світлий)</label>
                            <input type="color" value="${lp.colorA || '#ffffff'}" oninput="upd('colorA', this.value)" style="width:100%; height:32px; background:none; border:1px solid var(--border-color); border-radius:4px; cursor:pointer;">
                        </div>
                        <div>
                            <label class="property-label">Колір B (Темний)</label>
                            <input type="color" value="${lp.colorB || '#000000'}" oninput="upd('colorB', this.value)" style="width:100%; height:32px; background:none; border:1px solid var(--border-color); border-radius:4px; cursor:pointer;">
                        </div>
                    </div>
                ` : ''}

                ${colorMode === 'color_ramp' ? `
                    <div style="margin-top:8px;">
                        <label class="property-label">Пресети палітри</label>
                        <select class="form-control" onchange="applyPalettePresetToLayer(this.value)" style="margin-bottom:8px; width:100%; height:30px; font-size:11px;">
                            <option value="custom" ${(!lp.palettePreset || lp.palettePreset==='custom')?'selected':''}>— Користувацька палітра —</option>
                            <option value="wood_oak" ${lp.palettePreset==='wood_oak'?'selected':''}>Дерево: Дуб (Oak)</option>
                            <option value="wood_mahogany" ${lp.palettePreset==='wood_mahogany'?'selected':''}>Дерево: Махагоні</option>
                            <option value="marble_carrara" ${lp.palettePreset==='marble_carrara'?'selected':''}>Мармур: Каррара</option>
                            <option value="stone_slate" ${lp.palettePreset==='stone_slate'?'selected':''}>Камінь: Сланець</option>
                            <option value="moss_forest" ${lp.palettePreset==='moss_forest'?'selected':''}>Мох та Ліс</option>
                            <option value="lava_fire" ${lp.palettePreset==='lava_fire'?'selected':''}>Лава / Вогонь</option>
                            <option value="gold_polished" ${lp.palettePreset==='gold_polished'?'selected':''}>Золото</option>
                            <option value="cyberpunk" ${lp.palettePreset==='cyberpunk'?'selected':''}>Кіберпанк / Неон</option>
                            <option value="ocean_deep" ${lp.palettePreset==='ocean_deep'?'selected':''}>Океанська глибина</option>
                            <option value="leather_brown" ${lp.palettePreset==='leather_brown'?'selected':''}>Шкіра (Leather)</option>
                            <option value="rust_iron" ${lp.palettePreset==='rust_iron'?'selected':''}>Іржа / Залізо</option>
                            <option value="sand_dune" ${lp.palettePreset==='sand_dune'?'selected':''}>Пісок та Дюни</option>
                            <option value="ice_glacier" ${lp.palettePreset==='ice_glacier'?'selected':''}>Лід та Льодовик</option>
                        </select>
                        <div id="layerColorRampPreview" style="${colorRampPreview}"></div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <label class="property-label" style="margin:0;">Точки палітри (${sortedLayerStops.length})</label>
                            <button type="button" onclick="addColorRampStop()" class="btn btn-primary" style="padding:2px 6px; font-size:10px;">+ Точка</button>
                        </div>
                        ${colorStopsHTML}
                    </div>
                ` : ''}

                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color, #27272a); border-radius: 8px; padding: 8px; margin-top: 10px;">
                    <div style="font-weight:600; color:var(--primary-color, #3b82f6); font-size:11px; margin-bottom:8px;">🎨 Корекція кольору шару (HSL)</div>
                    ${createSlider("Зсув відтінку (Hue)", "hueShift", -180, 180, 1, lp.hueShift || 0, false, 0)}
                    ${createSlider("Насиченість (Saturation %)", "saturation", 0, 200, 1, lp.saturation !== undefined ? lp.saturation : 100, false, 100)}
                    ${createSlider("Соковитість (Vibrance)", "vibrance", -100, 100, 1, lp.vibrance || 0, false, 0)}
                    <div class="property-group" style="margin-top:6px;">
                        <label class="checkbox-label" style="font-size:11px; display:flex; align-items:center; gap:6px;">
                            <input type="checkbox" ${lp.colorInvert ? 'checked' : ''} onchange="upd('colorInvert', this.checked)">
                            <span>Інверсія кольорів шару</span>
                        </label>
                    </div>
                </div>
            `;

            layerBlockContents.warps = `
                ${renderWarpOrderToggle(lp.warpOrder, "updWarpOrder", false)}
                <div class="property-group" style="margin-bottom:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <label class="property-label" style="margin:0;">Деформації шару</label>
                        <button onclick="addWarp()" class="btn btn-primary" style="padding:4px 8px; font-size:10px;">+ Додати</button>
                    </div>
                    ${warpsHTML || '<div style="font-size:11px; color:var(--text-muted);">Деформатори відсутні. Натисніть "+ Додати", щоб додати викривлення.</div>'}
                </div>
            `;

            let blockMeta = {
                algo: { title: t("acc_algo"), icon: "🎨" },
                color: { title: "Колір та Палітра (Color & Palette)", icon: "🌈" },
                transform: { title: t("acc_transform"), icon: "📐" },
                fx: { title: t("acc_fx"), icon: "✨" },
                warps: { title: t("acc_warps"), icon: "🌀" }
            };

            // Build panel HTML by rendering accordion blocks in current order
            let html = accordionConfig.layer.order.filter(key => key !== 'blend').map(key => {
                let meta = blockMeta[key];
                if (!meta || !layerBlockContents[key]) return '';
                return renderAccordionBlock('layer', key, meta.title, meta.icon, layerBlockContents[key]);
            }).join('');

            p.innerHTML = html;
            window.lay = lay;
            renderStickyHeader();
        }

        function renderGlobal() {
            let g = state.global;
            if (!g.warps) g.warps = [];
            let modeBtn = (m, label) => `<button onclick="setTileMode('${m}')" class="gen-btn ${g.tileMode===m?'active':''}">${label}</button>`;

            let globalBlockContents = {};

            // Block: warps
            let globalWarpsHTML = (g.warps || []).map((w, idx) => renderWarpCardHTML(w, idx, true)).join('');

            globalBlockContents.warps = `
                ${renderWarpOrderToggle(g.warpOrder, "updGlobalWarpOrder", true)}
                <div class="property-group" style="margin-bottom:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <label class="property-label" style="margin:0;">Глобальні деформації</label>
                        <button onclick="addGlobalWarp()" class="btn btn-primary" style="padding:4px 8px; font-size:10px;">+ Додати</button>
                    </div>
                    ${globalWarpsHTML || '<div style="font-size:11px; color:var(--text-muted);">Деформатори відсутні. Натисніть "+ Додати", щоб додати викривлення на всі шари.</div>'}
                </div>
            `;

            // Block: transform
            globalBlockContents.transform = `
                <div class="property-group" style="margin-bottom:8px;">
                    <button onclick="resetGlobalSettings()" class="btn btn-secondary" style="width:100%;" title="Скинути корекції, трансформацію і тайлінг до значений за замовчуванням">↺ Скинути глобальні налаштування</button>
                </div>
                ${renderWarpOrderToggle(g.warpOrder, "updGlobalWarpOrder", true)}
                ${createSlider("Масштаб (Zoom)", "globalZoom", 0.1, 5, 0.05, g.globalZoom, true, 1)}
                ${createSlider("Масштаб по X", "globalScaleX", 0.1, 10, 0.05, g.globalScaleX !== undefined ? g.globalScaleX : 1, true, 1)}
                ${createSlider("Масштаб по Y", "globalScaleY", 0.1, 10, 0.05, g.globalScaleY !== undefined ? g.globalScaleY : 1, true, 1)}
                ${createSlider("Поворот", "globalRotation", -180, 180, 1, g.globalRotation, true, 0)}
                ${createSlider("Зсув X", "globalOffsetX", -2, 2, 0.02, g.globalOffsetX, true, 0)}
                ${createSlider("Зсув Y", "globalOffsetY", -2, 2, 0.02, g.globalOffsetY, true, 0)}
                ${createSlider("Перспектива вертикальна", "globalPerspectiveV", -500, 500, 1, g.globalPerspectiveV || 0, true, 0)}
                ${createSlider("Перспектива горизонтальна", "globalPerspectiveH", -500, 500, 1, g.globalPerspectiveH || 0, true, 0)}
            `;

            // Block: tiling
            globalBlockContents.tiling = `
                <div class="property-group">
                    <label class="property-label">Режим</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        ${modeBtn('off','Вимкнено')}${modeBtn('wrap','Повторення')}${modeBtn('mirror','Дзеркало')}${modeBtn('blend','Зсув + Блендинг')}
                    </div>
                </div>
                ${g.tileMode !== 'off' ? createSlider("Тайлів по X", "tileRepeatX", 1, 12, 1, g.tileRepeatX, true, 2) + createSlider("Тайлів по Y", "tileRepeatY", 1, 12, 1, g.tileRepeatY, true, 2) : ''}
                ${g.tileMode !== 'off' ? `
                    <div class="property-group"><label class="property-label" style="margin-bottom:0;">Зсув шва — посунути копії, щоб підібрати збіг деталей</label></div>
                    ${createSlider("Зсув шва X", "tileSeamOffsetX", -0.5, 0.5, 0.01, g.tileSeamOffsetX, true, 0)}
                    ${createSlider("Зсув шва Y", "tileSeamOffsetY", -0.5, 0.5, 0.01, g.tileSeamOffsetY, true, 0)}
                ` : ''}
                ${g.tileMode === 'mirror' ? `
                    <div class="property-group">
                        <label class="checkbox-label"><input type="checkbox" ${g.tileMirrorX?'checked':''} onchange="state.global.tileMirrorX=this.checked; invalidateCaches(); requestRender();"> Дзеркалити по X (інакше — повторення)</label>
                        <label class="checkbox-label"><input type="checkbox" ${g.tileMirrorY?'checked':''} onchange="state.global.tileMirrorY=this.checked; invalidateCaches(); requestRender();"> Дзеркалити по Y (інакше — повторення)</label>
                    </div>
                ` : ''}
                ${(g.tileMode === 'wrap' || g.tileMode === 'mirror') ? `
                    <div class="property-group">
                        <label class="checkbox-label"><input type="checkbox" ${g.forceSeamless?'checked':''} onchange="state.global.forceSeamless=this.checked; invalidateCaches(); renderGlobal(); requestRender();"> Змішування країв (додаткове згладжування шва)</label>
                    </div>
                ` : ''}
                ${g.tileMode === 'blend' ? `<div class="property-group"><label class="property-label" style="margin-bottom:0;">Змішування країв — увімкнено для цього режиму</label></div>` : ''}
                ${(g.tileMode !== 'off' && (g.forceSeamless || g.tileMode === 'blend')) ? `
                    ${createSlider("Ширина змішування (м'якість шва)", "forceSeamlessSoftness", 0, 1, 0.05, g.forceSeamlessSoftness, true, 1)}
                    <div class="property-group">
                        <label class="property-label">Крива згладжування шва</label>
                        <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                            <button onclick="setBlendCurve('smooth')" class="gen-btn ${g.blendCurve!=='linear'?'active':''}">Плавна (spline)</button>
                            <button onclick="setBlendCurve('linear')" class="gen-btn ${g.blendCurve==='linear'?'active':''}">Лінійна</button>
                        </div>
                    </div>
                ` : ''}
            `;

            // Block: fx
            let vAmt = g.vignetteAmount !== undefined ? g.vignetteAmount : (g.vignette ? -Math.round(g.vignette * 100) : 0);
            let vMid = g.vignetteMidpoint !== undefined ? g.vignetteMidpoint : 50;
            let vFeath = g.vignetteFeather !== undefined ? g.vignetteFeather : 50;
            let vRound = g.vignetteRoundness !== undefined ? g.vignetteRoundness : 0;
            let vHigh = g.vignetteHighlights !== undefined ? g.vignetteHighlights : 0;
            let vCX = g.vignetteCenterX !== undefined ? g.vignetteCenterX : 0.5;
            let vCY = g.vignetteCenterY !== undefined ? g.vignetteCenterY : 0.5;
            let isVignetteOpen = window.vignetteDetailsOpen ? 'open' : '';

            globalBlockContents.fx = `
                ${createSlider("Контраст", "contrast", 0.5, 2, 0.05, g.contrast, true, 1)}
                ${createSlider("Гамма", "gamma", 0.2, 3, 0.05, g.gamma, true, 1)}
                
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color, #27272a); border-radius: 8px; padding: 10px; margin: 10px 0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span class="property-label" style="font-weight:700; color:var(--primary-color, #3b82f6); margin:0;">📷 Віньєтка</span>
                        <button type="button" class="reset-btn" title="Скинути віньєтку" onclick="applyVignettePreset('reset')">↺</button>
                    </div>
                    
                    ${createSlider("Інтенсивність (Amount)", "vignetteAmount", -100, 100, 1, vAmt, true, 0)}
                    
                    <details id="vignette_details" ${isVignetteOpen} ontoggle="window.vignetteDetailsOpen=this.open;" style="margin-top:8px; border-top:1px solid rgba(255,255,255,0.08); padding-top:6px;">
                        <summary style="font-size:11px; font-weight:600; color:var(--text-muted, #a1a1aa); cursor:pointer; user-select:none; padding:4px 0;">⚙️ Розширені налаштування</summary>
                        <div style="margin-top:8px;">
                            <div class="property-group" style="margin-bottom:8px;">
                                <label class="property-label" style="font-size:10px; margin-bottom:4px;">Пресети віньєтки</label>
                                <div class="gen-grid" style="grid-template-columns:repeat(4,1fr); gap:4px;">
                                    <button type="button" onclick="applyVignettePreset('dark')" class="gen-btn" style="font-size:10px; padding:4px 2px;" title="Класична темна віньєтка">Темна</button>
                                    <button type="button" onclick="applyVignettePreset('soft')" class="gen-btn" style="font-size:10px; padding:4px 2px;" title="М'який фокус">М'яка</button>
                                    <button type="button" onclick="applyVignettePreset('dramatic')" class="gen-btn" style="font-size:10px; padding:4px 2px;" title="Драматичний прямокутник">Прямокут.</button>
                                    <button type="button" onclick="applyVignettePreset('light')" class="gen-btn" style="font-size:10px; padding:4px 2px;" title="Світле сяйво">Світла</button>
                                </div>
                            </div>

                            ${createSlider("Середина (Midpoint)", "vignetteMidpoint", 0, 100, 1, vMid, true, 50)}
                            ${createSlider("Розмиття країв (Feather)", "vignetteFeather", 0, 100, 1, vFeath, true, 50)}
                            ${createSlider("Округлість (Roundness)", "vignetteRoundness", -100, 100, 1, vRound, true, 0)}
                            ${createSlider("Захист світлих тонів (Highlights)", "vignetteHighlights", 0, 100, 1, vHigh, true, 0)}
                            ${createSlider("Центр X (Position X)", "vignetteCenterX", 0, 1, 0.01, vCX, true, 0.5)}
                            ${createSlider("Центр Y (Position Y)", "vignetteCenterY", 0, 1, 0.01, vCY, true, 0.5)}
                        </div>
                    </details>
                </div>

                ${createSlider("Глобальне розмиття", "blur", 0, 100, 1, g.blur||0, true, 0)}
                <div class="property-group" style="margin-top:-6px;">
                    <label class="property-label" style="font-size:11px; margin-bottom:4px;">Тип розмиття</label>
                    <div class="gen-grid" style="grid-template-columns:repeat(2,1fr);">
                        <button onclick="upd('blurType','gaussian',true)" class="gen-btn ${(g.blurType||'gaussian')==='gaussian'?'active':''}">Гаус (Gaussian)</button>
                        <button onclick="upd('blurType','box',true)" class="gen-btn ${g.blurType==='box'?'active':''}">Бокс (Box)</button>
                    </div>
                </div>
                <div class="property-group" style="margin-top:-6px;">
                    <label class="checkbox-label" style="font-size:11px; display:flex; align-items:center; gap:6px;">
                        <input type="checkbox" ${g.blurClampEdge ? 'checked' : ''} onchange="state.global.blurClampEdge=this.checked; invalidateCaches(); requestRender(); commitHistorySnapshot();">
                        <span>Repeat Edge Pixels / Clamp to Edge</span>
                    </label>
                </div>
                ${createSlider("Зерно", "grain", 0, 50, 1, g.grain, true, 10)}
            `;

            // Block: color
            globalBlockContents.color = `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color, #27272a); border-radius: 8px; padding: 10px; margin-bottom: 10px;">
                    <div style="font-weight:700; color:var(--primary-color, #3b82f6); font-size:11px; margin-bottom:8px;">🎨 Глобальна корекція кольору та тону</div>
                    ${createSlider("Зсув відтінку (Hue Shift)", "globalHueShift", -180, 180, 1, g.globalHueShift || 0, true, 0)}
                    ${createSlider("Насиченість (Saturation %)", "globalSaturation", 0, 200, 1, g.globalSaturation !== undefined ? g.globalSaturation : 100, true, 100)}
                    ${createSlider("Соковитість (Vibrance)", "globalVibrance", -100, 100, 1, g.globalVibrance || 0, true, 0)}
                    ${createSlider("Колірна температура (Warmth)", "globalColorTemp", -100, 100, 1, g.globalColorTemp || 0, true, 0)}
                    ${createSlider("Тінтування (Tint - Зелений/Маджента)", "globalColorTint", -100, 100, 1, g.globalColorTint || 0, true, 0)}
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color, #27272a); border-radius: 8px; padding: 10px; margin-bottom: 10px;">
                    <div style="font-weight:700; color:var(--primary-color, #3b82f6); font-size:11px; margin-bottom:8px;">🖼️ Накладання кольору (Color Overlay)</div>
                    <div class="property-group grid-2">
                        <div>
                            <label class="property-label">Колір накладання</label>
                            <input type="color" value="${g.globalColorOverlay || '#000000'}" oninput="state.global.globalColorOverlay=this.value; invalidateCaches(); requestRender();" onchange="commitHistorySnapshot();" style="width:100%; height:32px; background:none; border:1px solid var(--border-color); border-radius:4px; cursor:pointer;">
                        </div>
                        <div>
                            <label class="property-label">Непрозорість (%)</label>
                            <input type="number" class="num-input" min="0" max="100" value="${g.globalColorOverlayOpacity || 0}" oninput="state.global.globalColorOverlayOpacity=parseFloat(this.value); invalidateCaches(); requestRender();" onchange="commitHistorySnapshot();" style="width:100%; height:32px;">
                        </div>
                    </div>
                    ${createSlider("Прозорість оверлею", "globalColorOverlayOpacity", 0, 100, 1, g.globalColorOverlayOpacity || 0, true, 0)}
                </div>

                <div class="property-group" style="margin-top:8px;">
                    <label class="checkbox-label" style="font-size:11px; display:flex; align-items:center; gap:6px;">
                        <input type="checkbox" ${g.invert ? 'checked' : ''} onchange="state.global.invert=this.checked; invalidateCaches(); requestRender(); commitHistorySnapshot();">
                        <span>Інверсія всіх кольорів (Invert All)</span>
                    </label>
                </div>
            `;

            let blockMeta = {
                transform: { title: t("acc_gtform"), icon: "🌐" },
                color: { title: "Глобальний колір та тон (Color & Tone)", icon: "🎨" },
                warps: { title: t("acc_gwarps"), icon: "🌀" },
                tiling: { title: t("acc_gtiling"), icon: "🔁" },
                fx: { title: t("acc_gfx"), icon: "🎚️" }
            };

            let html = accordionConfig.global.order.map(key => {
                let meta = blockMeta[key];
                if (!meta || !globalBlockContents[key]) return '';
                return renderAccordionBlock('global', key, meta.title, meta.icon, globalBlockContents[key]);
            }).join('');

            $('propertiesPanel').innerHTML = html;
        }

        window.applyVignettePreset = function(preset) {
            if (!state.global) return;
            switch (preset) {
                case 'dark':
                    state.global.vignetteAmount = -50;
                    state.global.vignetteMidpoint = 50;
                    state.global.vignetteFeather = 50;
                    state.global.vignetteRoundness = 0;
                    state.global.vignetteHighlights = 20;
                    state.global.vignetteCenterX = 0.5;
                    state.global.vignetteCenterY = 0.5;
                    break;
                case 'soft':
                    state.global.vignetteAmount = -40;
                    state.global.vignetteMidpoint = 30;
                    state.global.vignetteFeather = 85;
                    state.global.vignetteRoundness = 20;
                    state.global.vignetteHighlights = 50;
                    state.global.vignetteCenterX = 0.5;
                    state.global.vignetteCenterY = 0.5;
                    break;
                case 'dramatic':
                    state.global.vignetteAmount = -75;
                    state.global.vignetteMidpoint = 40;
                    state.global.vignetteFeather = 30;
                    state.global.vignetteRoundness = -70;
                    state.global.vignetteHighlights = 10;
                    state.global.vignetteCenterX = 0.5;
                    state.global.vignetteCenterY = 0.5;
                    break;
                case 'light':
                    state.global.vignetteAmount = 50;
                    state.global.vignetteMidpoint = 50;
                    state.global.vignetteFeather = 60;
                    state.global.vignetteRoundness = 0;
                    state.global.vignetteHighlights = 0;
                    state.global.vignetteCenterX = 0.5;
                    state.global.vignetteCenterY = 0.5;
                    break;
                case 'reset':
                default:
                    state.global.vignetteAmount = 0;
                    state.global.vignetteMidpoint = 50;
                    state.global.vignetteFeather = 50;
                    state.global.vignetteRoundness = 0;
                    state.global.vignetteHighlights = 0;
                    state.global.vignetteCenterX = 0.5;
                    state.global.vignetteCenterY = 0.5;
                    break;
            }
            state.global.vignette = Math.abs(state.global.vignetteAmount / 100);
            renderGlobal();
            requestRender();
            commitHistorySnapshot();
        };

        function setTileMode(mode) {
            state.global.tileMode = mode;
            if (mode === 'off') {
                state.global.forceSeamless = false;
            }
            invalidateCaches();
            renderGlobal();
            requestRender();
        }

        function setBlendCurve(curve) {
            state.global.blendCurve = curve;
            invalidateCaches();
            renderGlobal();
            requestRender();
        }

        // =========================================================================
        // === SEAMLESS TEXTURE STUDIO PRO v9.0 — СИСТЕМА БЕЗШОВНОГО ТАЙЛІНГУ ===
        // =========================================================================

        let tilingOriginalCanvas = null;
        let tilingProcessedCanvas = null;
        let tilingStampCanvas = null;
        let tilingMaskCanvas = null;
        let tilingLastSeams = null;
        let initialStampSource = null;
        let stampSource = null;
        let selectingStampSource = false;
        let stampCursorX = -9999;
        let stampCursorY = -9999;
        let isStamping = false;
        let isMaskBrushing = false;
        let lastDrawPos = null;
        let stampBackupCanvas = null;
        let maskBackupCanvas = null;

        function ensureTilingStampCanvas(w, h) {
            if (!tilingStampCanvas) {
                tilingStampCanvas = document.createElement('canvas');
            }
            if (tilingStampCanvas.width !== w || tilingStampCanvas.height !== h) {
                tilingStampCanvas.width = w;
                tilingStampCanvas.height = h;
            }
        }

        function clearTilingStampCanvas() {
            if (tilingStampCanvas) {
                let sctx = tilingStampCanvas.getContext('2d');
                sctx.clearRect(0, 0, tilingStampCanvas.width, tilingStampCanvas.height);
            }
        }

        function backupTilingStamp() {
            if (!tilingStampCanvas) return;
            if (!stampBackupCanvas) stampBackupCanvas = document.createElement('canvas');
            stampBackupCanvas.width = tilingStampCanvas.width;
            stampBackupCanvas.height = tilingStampCanvas.height;
            let bctx = stampBackupCanvas.getContext('2d');
            bctx.clearRect(0, 0, stampBackupCanvas.width, stampBackupCanvas.height);
            bctx.drawImage(tilingStampCanvas, 0, 0);
        }

        function restoreTilingStampBackup() {
            if (stampBackupCanvas && tilingStampCanvas) {
                let sctx = tilingStampCanvas.getContext('2d');
                sctx.clearRect(0, 0, tilingStampCanvas.width, tilingStampCanvas.height);
                sctx.drawImage(stampBackupCanvas, 0, 0);
            }
        }

        function cancelStamping() {
            if (isStamping) {
                isStamping = false;
                restoreTilingStampBackup();
                if (initialStampSource) {
                    stampSource = { x: initialStampSource.x, y: initialStampSource.y };
                }
                runTilingPipeline();
            }
        }

        function ensureTilingMaskCanvas(w, h) {
            if (!tilingMaskCanvas) {
                tilingMaskCanvas = document.createElement('canvas');
            }
            if (tilingMaskCanvas.width !== w || tilingMaskCanvas.height !== h) {
                tilingMaskCanvas.width = w;
                tilingMaskCanvas.height = h;
            }
        }

        function clearTilingMaskCanvas() {
            if (tilingMaskCanvas) {
                let mctx = tilingMaskCanvas.getContext('2d');
                mctx.clearRect(0, 0, tilingMaskCanvas.width, tilingMaskCanvas.height);
            }
        }

        function backupTilingMask() {
            if (!tilingMaskCanvas) return;
            if (!maskBackupCanvas) maskBackupCanvas = document.createElement('canvas');
            maskBackupCanvas.width = tilingMaskCanvas.width;
            maskBackupCanvas.height = tilingMaskCanvas.height;
            let bctx = maskBackupCanvas.getContext('2d');
            bctx.clearRect(0, 0, maskBackupCanvas.width, maskBackupCanvas.height);
            bctx.drawImage(tilingMaskCanvas, 0, 0);
        }

        function restoreTilingMaskBackup() {
            if (maskBackupCanvas && tilingMaskCanvas) {
                let mctx = tilingMaskCanvas.getContext('2d');
                mctx.clearRect(0, 0, tilingMaskCanvas.width, tilingMaskCanvas.height);
                mctx.drawImage(maskBackupCanvas, 0, 0);
            }
        }

        function cancelMaskBrushing() {
            if (isMaskBrushing) {
                isMaskBrushing = false;
                restoreTilingMaskBackup();
                runTilingPipeline();
            }
        }

        function toggleTilingMaskBrush(enable) {
            tilingState.mask_brush_enable = enable;
            if (enable) tilingState.stamp_enable = false;
            renderTilingPanel();
            renderTilingView();
        }

        let tilingState = {
            enabled: false,
            customImageLoaded: false,
            hasImage: false,
            currentViewMode: 'single', // 'single', 'tiled', 'tiled3', 'original'
            showGrid: false,
            showSeams: false,

            preset: 'organic',

            stamp_enable: false,
            stamp_mode: 'clone', // 'clone' or 'erase'
            stamp_aligned: true,
            stamp_size: 30,
            stamp_opacity: 80,
            stamp_softness: 60,

            mask_brush_enable: false,
            mask_brush_mode: 'erase_seam', // 'erase_seam' (reveal original) or 'restore_seam' (restore tile)
            mask_brush_size: 30,
            mask_brush_opacity: 80,
            mask_brush_softness: 60,

            guard_enable: true,
            guard_width: 16,
            guard_mix_strength: 85,
            guard_blend_mode: 'cosine',
            guard_jitter: 8,
            guard_frequency: 0.08,
            guard_detail_preserve: 70,

            guard_seam_algo: 'dp_mincost',
            guard_seam_metric: 'lab',
            guard_search: 15,
            guard_stiffness: 1.2,
            guard_grad_weight: 2.0,
            guard_warp_mode: 'chaotic',
            guard_warp_amp: 8,
            guard_warp_freq: 0.08,
            guard_curve: 'cosine',
            guard_overlap: 14,
            guard_feather: 8,
            guard_blur_radius: 8,

            seam_algo: 'dp_mincost',
            seam_metric: 'lab',
            seam_search: 20,
            seam_stiffness: 1.2,
            seam_grad_weight: 2.5,

            seam_warp_mode: 'chaotic',
            seam_warp_amp: 10,
            seam_warp_freq: 0.06,
            seam_warp_jitter: 4,

            seam_curve: 'sigmoid',
            seam_overlap: 14,
            seam_feather: 8,
            seam_blur_radius: 12,
            seam_contrast_match: 50,

            luma_balance_enable: true,
            luma_balance_strength: 75,

            flat_enable: true,
            flat_strength: 0.80,

            offset_x: 50,
            offset_y: 50,

            freq_gain: 1.30,
            freq_radius: 3,
            sharpen: 0.40,
            micro_contrast: 1.10,
            micro_noise: 2.5,
            micro_noise_scale: 'fine',

            accordions: {
                stamp: false,
                mask: false,
                guard: false,
                dp: false,
                warp: false,
                blend: false,
                luma: false,
                flat: false,
                offset: false,
                fx: false
            }
        };

        function getCanvasPos(e) {
            if (!canvas) return { x: 0, y: 0 };

            let clientX = e.clientX;
            let clientY = e.clientY;

            if (clientX === undefined || clientY === undefined) {
                if (e.touches && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else if (e.changedTouches && e.changedTouches.length > 0) {
                    clientX = e.changedTouches[0].clientX;
                    clientY = e.changedTouches[0].clientY;
                } else if (e.targetTouches && e.targetTouches.length > 0) {
                    clientX = e.targetTouches[0].clientX;
                    clientY = e.targetTouches[0].clientY;
                }
            }

            if (clientX === undefined || clientY === undefined) return { x: 0, y: 0 };

            const rect = canvas.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };

            const targetW = canvas.width;
            const targetH = canvas.height;

            let normX = 0;
            let normY = 0;

            if (!viewport || !viewport.angle) {
                normX = (clientX - rect.left) / rect.width;
                normY = (clientY - rect.top) / rect.height;
            } else {
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const dx = clientX - centerX;
                const dy = clientY - centerY;
                const rad = -viewport.angle * Math.PI / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const rotX = dx * cos - dy * sin;
                const rotY = dx * sin + dy * cos;
                const scale = (viewport && viewport.scale) || 1;
                const cssW = (canvas.offsetWidth || rect.width / scale || 512) * scale;
                const cssH = (canvas.offsetHeight || rect.height / scale || 512) * scale;
                normX = rotX / cssW + 0.5;
                normY = rotY / cssH + 0.5;
            }

            return {
                x: normX * targetW,
                y: normY * targetH
            };
        }

        function toggleEnableTiling(enabled) {
            tilingState.enabled = enabled;
            let chk = $('chkEnableTiling');
            if (chk) chk.checked = enabled;
            renderTilingPanel();
            requestRender();
            commitHistorySnapshot();
            scheduleAutoSave();
        }
        window.toggleEnableTiling = toggleEnableTiling;

        function setViewModeTiling(mode) {
            tilingState.currentViewMode = mode;
            renderTilingPanel();
            renderTilingView();
        }

        function toggleTilingAccordion(accKey) {
            tilingState.accordions[accKey] = !tilingState.accordions[accKey];
            let content = $(`acc_tiling_${accKey}`);
            let chev = $(`acc_tiling_${accKey}_chev`);
            if (content) content.classList.toggle('show', tilingState.accordions[accKey]);
            if (chev) chev.classList.toggle('open', tilingState.accordions[accKey]);
        }

        function updTiling(key, val, suffix='') {
            if (key in tilingState) {
                tilingState[key] = (typeof tilingState[key] === 'number') ? parseFloat(val) : val;
                let vSpan = $(`tiling_val_${key}`);
                if (vSpan) vSpan.innerText = val + suffix;
            }
            if (tilingState.hasImage && !key.startsWith('stamp')) {
                runTilingPipeline();
            } else {
                renderTilingView();
            }
            scheduleHistorySnapshot();
            scheduleAutoSave();
        }

        function tilingSlider(label, key, min, max, step, suffix, defVal) {
            let val = tilingState[key];
            if (defVal === undefined) defVal = val;
            return `
                <div class="control-group">
                    <div class="control-label">
                        <span>${t(label)}</span>
                        <span class="control-value" id="tiling_val_${key}">${val}${suffix}</span>
                    </div>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <input type="range" id="rng_tiling_${key}" min="${min}" max="${max}" step="${step}" value="${val}" oninput="updTiling('${key}', this.value, '${suffix}'); if ($('num_tiling_${key}')) $('num_tiling_${key}').value=this.value;" onchange="scheduleHistorySnapshot(); scheduleAutoSave();">
                        <input type="number" class="num-input" id="num_tiling_${key}" min="${min}" max="${max}" step="${step}" value="${val}" oninput="updTiling('${key}', this.value, '${suffix}'); if ($('rng_tiling_${key}')) $('rng_tiling_${key}').value=this.value;" onchange="scheduleHistorySnapshot(); scheduleAutoSave();">
                        <button type="button" class="reset-btn" title="${t('reset_default_title', {def: defVal})}" onclick="updTiling('${key}', ${defVal}, '${suffix}'); if ($('rng_tiling_${key}')) $('rng_tiling_${key}').value=${defVal}; if ($('num_tiling_${key}')) $('num_tiling_${key}').value=${defVal}; scheduleHistorySnapshot(); scheduleAutoSave();">↺</button>
                    </div>
                </div>
            `;
        }

        function toggleTilingStamp(enabled) {
            tilingState.stamp_enable = enabled;
            selectingStampSource = false;
            if (enabled) {
                if (canvas) canvas.style.cursor = 'crosshair';
            } else {
                if (canvas) canvas.style.cursor = 'grab';
                initialStampSource = null;
                stampSource = null;
                stampCursorX = -9999;
                stampCursorY = -9999;
            }
            renderTilingPanel();
            renderTilingView();
        }

        function toggleSelectingStampSource() {
            selectingStampSource = !selectingStampSource;
            if (selectingStampSource) {
                tilingState.stamp_enable = true;
                if (canvas) canvas.style.cursor = 'crosshair';
            }
            renderTilingPanel();
            renderTilingView();
        }

        function applyTilingPreset(p) {
            tilingState.preset = p;
            if (p === 'organic') {
                tilingState.seam_search = 25;
                tilingState.seam_stiffness = 0.8;
                tilingState.seam_warp_mode = 'chaotic';
                tilingState.seam_warp_amp = 14;
                tilingState.seam_curve = 'sigmoid';
                tilingState.guard_jitter = 10;
                tilingState.guard_blend_mode = 'stochastic';
            } else if (p === 'pattern') {
                tilingState.seam_search = 12;
                tilingState.seam_stiffness = 2.8;
                tilingState.seam_warp_mode = 'sine';
                tilingState.seam_warp_amp = 2;
                tilingState.seam_curve = 'cosine';
                tilingState.guard_jitter = 2;
                tilingState.guard_blend_mode = 'cosine';
            } else if (p === 'wood') {
                tilingState.seam_search = 18;
                tilingState.seam_stiffness = 2.0;
                tilingState.seam_warp_mode = 'fractal';
                tilingState.seam_warp_amp = 8;
                tilingState.seam_curve = 'gaussian';
                tilingState.guard_jitter = 5;
                tilingState.guard_blend_mode = 'sigmoid';
            } else if (p === 'micro') {
                tilingState.freq_gain = 2.2;
                tilingState.freq_radius = 2;
                tilingState.sharpen = 0.8;
                tilingState.micro_contrast = 1.25;
                tilingState.micro_noise = 4.0;
                tilingState.micro_noise_scale = 'fine';
            }
            renderTilingPanel();
            if (tilingState.hasImage) runTilingPipeline();
            commitHistorySnapshot();
            scheduleAutoSave();
        }

        function resetTilingToDefaults() {
            tilingState.enabled = false;
            tilingState.customImageLoaded = false;
            tilingState.preset = 'organic';
            tilingState.stamp_enable = false;
            tilingState.stamp_aligned = true;
            tilingState.stamp_size = 30;
            tilingState.stamp_opacity = 80;
            tilingState.stamp_softness = 60;
            tilingState.guard_enable = true;
            tilingState.guard_width = 16;
            tilingState.guard_mix_strength = 85;
            tilingState.guard_blend_mode = 'cosine';
            tilingState.guard_jitter = 8;
            tilingState.guard_frequency = 0.08;
            tilingState.guard_detail_preserve = 70;
            tilingState.seam_algo = 'dp_mincost';
            tilingState.seam_metric = 'lab';
            tilingState.seam_search = 20;
            tilingState.seam_stiffness = 1.2;
            tilingState.seam_grad_weight = 2.5;
            tilingState.seam_warp_mode = 'chaotic';
            tilingState.seam_warp_amp = 10;
            tilingState.seam_warp_freq = 0.06;
            tilingState.seam_warp_jitter = 4;
            tilingState.seam_curve = 'sigmoid';
            tilingState.seam_overlap = 14;
            tilingState.seam_feather = 8;
            tilingState.seam_blur_radius = 12;
            tilingState.seam_contrast_match = 50;
            tilingState.luma_balance_enable = true;
            tilingState.luma_balance_strength = 75;
            tilingState.flat_enable = true;
            tilingState.flat_strength = 0.80;
            tilingState.offset_x = 50;
            tilingState.offset_y = 50;
            tilingState.freq_gain = 1.30;
            tilingState.freq_radius = 3;
            tilingState.sharpen = 0.40;
            tilingState.micro_contrast = 1.10;
            tilingState.micro_noise = 2.5;
            tilingState.micro_noise_scale = 'fine';
            initialStampSource = null;
            stampSource = null;
            selectingStampSource = false;
            if (canvas) canvas.style.cursor = 'grab';
            renderTilingPanel();
            if (tilingState.hasImage) runTilingPipeline();
            commitHistorySnapshot();
            scheduleAutoSave();
        }

        function captureProjectToTiling() {
            tilingState.customImageLoaded = false;
            requestRender();
        }

        function applyTilingToLayer() {
            if (!tilingProcessedCanvas || !tilingState.hasImage) return;
            prepareStateForSerialization();
            let id = 'l' + Date.now();
            let newLay = {
                id,
                name: 'Безшовний тайл',
                visible: true,
                opacity: 100,
                blendMode: 'normal',
                generatorType: 'paint',
                isMask: false,
                params: freshLayerParams()
            };
            ensureLayerPaintCanvas(newLay);
            let pCtx = newLay.paintCanvas.getContext('2d');
            pCtx.clearRect(0, 0, 1024, 1024);
            pCtx.drawImage(tilingProcessedCanvas, 0, 0, 1024, 1024);
            newLay.isDirty = true;

            state.layers.unshift(newLay);
            state.selectedLayerId = id;
            commitHistorySnapshot();
            renderLayers();
            switchRightTab('layer');
            requestRender();
        }

        function handleTilingImageUpload(e) {
            let file = e.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.onload = function(event) {
                let img = new Image();
                img.onload = function() {
                    if (!tilingOriginalCanvas) {
                        tilingOriginalCanvas = document.createElement('canvas');
                    }
                    tilingOriginalCanvas.width = img.width;
                    tilingOriginalCanvas.height = img.height;
                    let octx = tilingOriginalCanvas.getContext('2d');
                    octx.drawImage(img, 0, 0);
                    tilingState.hasImage = true;
                    tilingState.customImageLoaded = true;
                    renderTilingPanel();
                    runTilingPipeline();
                    requestRender();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        }

        function openTilingExportModal() {
            if (!tilingProcessedCanvas || !tilingState.hasImage) return;
            let modalImg = $('modalPngPreview');
            if (modalImg) {
                modalImg.src = tilingProcessedCanvas.toDataURL('image/png');
            }
            let modal = $('pngModal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }

        // --- Алгоритми обробки текстур ---
        function pseudoNoise(x, y) {
            let n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
            return n - Math.floor(n);
        }

        function getPixelWrapped(pixels, w, h, x, y, c) {
            let wx = (x % w + w) % w;
            let wy = (y % h + h) % h;
            return pixels[(wy * w + wx) * 4 + c];
        }

        function getBlendAlpha(t, curveType, x, y) {
            t = Math.max(0, Math.min(1, t));
            if (curveType === 'sigmoid') {
                return 1 / (1 + Math.exp(-10 * (t - 0.5)));
            } else if (curveType === 'gaussian') {
                return Math.exp(-Math.pow((t - 0.5) * 3, 2));
            } else if (curveType === 'dither' || curveType === 'stochastic') {
                let ditherVal = (pseudoNoise(x, y) - 0.5) * 0.3;
                return Math.max(0, Math.min(1, t + ditherVal));
            } else if (curveType === 'cosine') {
                return 0.5 - 0.5 * Math.cos(Math.PI * t);
            } else if (curveType === 'exponential') {
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            } else if (curveType === 'smoothstep') {
                return t * t * (3 - 2 * t);
            } else {
                return t;
            }
        }

        function getWarpOffset(i, mode, amp, freq, jitter) {
            let offset = 0;
            if (mode === 'sine') {
                offset = Math.sin(i * freq) * amp + Math.cos(i * freq * 1.7) * (amp * 0.4);
            } else if (mode === 'chaotic') {
                offset = Math.sin(i * freq) * amp + Math.sin(i * freq * 2.7 + 1.2) * (amp * 0.6) + (pseudoNoise(i, 1) - 0.5) * amp * 0.5;
            } else if (mode === 'jitter') {
                offset = (pseudoNoise(i, 87) - 0.5) * amp * 1.8;
            } else if (mode === 'fractal') {
                offset = Math.sin(i * freq) * amp + Math.sin(i * freq * 2) * (amp * 0.5) + Math.sin(i * freq * 4) * (amp * 0.25);
            }
            if (jitter > 0) offset += (pseudoNoise(i, 42) - 0.5) * jitter;
            return Math.round(offset);
        }

        function applyCyclicLumaBalance(pixels, w, h) {
            let strength = parseInt(tilingState.luma_balance_strength) / 100;
            if (strength <= 0) return;

            let stripW = Math.max(2, Math.floor(w * 0.08));
            let stripH = Math.max(2, Math.floor(h * 0.08));

            let lumaL = 0, lumaR = 0, countX = 0;
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < stripW; x++) {
                    let idxL = (y * w + x) * 4;
                    let idxR = (y * w + (w - 1 - x)) * 4;
                    lumaL += 0.299 * pixels[idxL] + 0.587 * pixels[idxL+1] + 0.114 * pixels[idxL+2];
                    lumaR += 0.299 * pixels[idxR] + 0.587 * pixels[idxR+1] + 0.114 * pixels[idxR+2];
                    countX++;
                }
            }
            lumaL /= countX; lumaR /= countX;

            let lumaT = 0, lumaB = 0, countY = 0;
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < stripH; y++) {
                    let idxT = (y * w + x) * 4;
                    let idxB = ((h - 1 - y) * w + x) * 4;
                    lumaT += 0.299 * pixels[idxT] + 0.587 * pixels[idxT+1] + 0.114 * pixels[idxT+2];
                    lumaB += 0.299 * pixels[idxB] + 0.587 * pixels[idxB+1] + 0.114 * pixels[idxB+2];
                    countY++;
                }
            }
            lumaT /= countY; lumaB /= countY;

            for (let y = 0; y < h; y++) {
                let factorY = -Math.cos((2 * Math.PI * y) / h);
                let corrY = (lumaB - lumaT) * 0.25 * factorY * strength;

                for (let x = 0; x < w; x++) {
                    let factorX = -Math.cos((2 * Math.PI * x) / w);
                    let corrX = (lumaR - lumaL) * 0.25 * factorX * strength;
                    let corr = corrX + corrY;

                    let idx = (y * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        pixels[idx + c] = Math.min(255, Math.max(0, pixels[idx + c] + corr));
                    }
                }
            }
        }

        function calcPixelCost(p1, p2, x, y, w, h, metric, gradW) {
            let idx = (y * w + x) * 4;
            let r1 = p1[idx], g1 = p1[idx+1], b1 = p1[idx+2];
            let r2 = p2[idx], g2 = p2[idx+1], b2 = p2[idx+2];

            let colorDist = 0;
            if (metric === 'lab') {
                let rmean = (r1 + r2) / 2;
                let dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
                colorDist = Math.sqrt((2 + rmean/256)*dr*dr + 4*dg*dg + (2 + (255-rmean)/256)*db*db);
            } else if (metric === 'rgb') {
                colorDist = Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
            } else if (metric === 'luma') {
                colorDist = Math.abs((0.299*r1 + 0.587*g1 + 0.114*b1) - (0.299*r2 + 0.587*g2 + 0.114*b2));
            }

            let gradDist = 0;
            if (gradW > 0 && x > 0 && x < w - 1 && y > 0 && y < h - 1) {
                let g1 = Math.abs(p1[idx + 4] - p1[idx - 4]) + Math.abs(p1[idx + w*4] - p1[idx - w*4]);
                let g2 = Math.abs(p2[idx + 4] - p2[idx - 4]) + Math.abs(p2[idx + w*4] - p2[idx - w*4]);
                gradDist = Math.abs(g1 - g2);
            }

            return colorDist + gradW * gradDist;
        }

        function computeDPPath(p1, p2, w, h, startOffset, bandSize, gradW, stiffness, metric, dir) {
            let steps = (dir === 'vertical') ? h : w;
            let dp = new Float32Array(steps * bandSize);
            let trace = new Int32Array(steps * bandSize);

            for (let k = 0; k < bandSize; k++) {
                let x = (dir === 'vertical') ? startOffset + k : 0;
                let y = (dir === 'vertical') ? 0 : startOffset + k;
                dp[k] = calcPixelCost(p1, p2, x, y, w, h, metric, gradW);
            }

            for (let i = 1; i < steps; i++) {
                for (let k = 0; k < bandSize; k++) {
                    let x = (dir === 'vertical') ? startOffset + k : i;
                    let y = (dir === 'vertical') ? i : startOffset + k;

                    let cost = calcPixelCost(p1, p2, x, y, w, h, metric, gradW);
                    let minPrev = dp[(i - 1) * bandSize + k];
                    let bestOffset = 0;

                    if (k > 0) {
                        let cLeft = dp[(i - 1) * bandSize + k - 1] + stiffness * 10;
                        if (cLeft < minPrev) { minPrev = cLeft; bestOffset = -1; }
                    }
                    if (k < bandSize - 1) {
                        let cRight = dp[(i - 1) * bandSize + k + 1] + stiffness * 10;
                        if (cRight < minPrev) { minPrev = cRight; bestOffset = 1; }
                    }

                    dp[i * bandSize + k] = cost + minPrev;
                    trace[i * bandSize + k] = k + bestOffset;
                }
            }

            let bestK = 0;
            let minVal = Infinity;
            for (let k = 0; k < bandSize; k++) {
                if (dp[(steps - 1) * bandSize + k] < minVal) {
                    minVal = dp[(steps - 1) * bandSize + k];
                    bestK = k;
                }
            }

            let path = new Int32Array(steps);
            path[steps - 1] = bestK;
            for (let i = steps - 1; i > 0; i--) {
                path[i - 1] = trace[i * bandSize + path[i]];
            }
            return path;
        }

        function applyOpticalDynamicSeamEngine(pixels, w, h, offX, offY) {
            let searchPct = parseInt(tilingState.seam_search) / 100;
            let gradWeight = parseFloat(tilingState.seam_grad_weight);
            let stiffness = parseFloat(tilingState.seam_stiffness);
            let metric = tilingState.seam_metric;

            let warpMode = tilingState.seam_warp_mode;
            let warpAmp = parseFloat(tilingState.seam_warp_amp);
            let warpFreq = parseFloat(tilingState.seam_warp_freq);
            let warpJitter = parseFloat(tilingState.seam_warp_jitter);

            let featherPx = parseInt(tilingState.seam_feather);
            let overlapPx = parseInt(tilingState.seam_overlap);
            let curveType = tilingState.seam_curve;
            let totalBlendSpan = featherPx + overlapPx;

            let bandW = Math.max(6, Math.floor(w * searchPct));
            let bandH = Math.max(6, Math.floor(h * searchPct));

            let refCanvas = document.createElement('canvas');
            refCanvas.width = w; refCanvas.height = h;
            let rctx = refCanvas.getContext('2d');
            rctx.drawImage(tilingOriginalCanvas, 0, 0);
            let refPixels = rctx.getImageData(0, 0, w, h).data;

            let copyPixels = new Uint8ClampedArray(pixels);

            let minX_L = Math.max(1, offX - bandW);
            let width_L = Math.max(2, offX - minX_L);
            let seamL = computeDPPath(copyPixels, refPixels, w, h, minX_L, width_L, gradWeight, stiffness, metric, 'vertical');

            let minX_R = offX;
            let width_R = Math.min(w - offX - 2, bandW);
            let seamR = computeDPPath(copyPixels, refPixels, w, h, minX_R, width_R, gradWeight, stiffness, metric, 'vertical');

            for (let y = 0; y < h; y++) {
                let wave = getWarpOffset(y, warpMode, warpAmp, warpFreq, warpJitter);
                seamL[y] = Math.max(0, Math.min(width_L - 1, seamL[y] + wave));
                seamR[y] = Math.max(0, Math.min(width_R - 1, seamR[y] - wave));
            }

            for (let y = 0; y < h; y++) {
                let cutL = minX_L + seamL[y];
                let cutR = minX_R + seamR[y];

                let xStart = Math.max(0, cutL - totalBlendSpan);
                let xEnd = Math.min(w - 1, cutR + totalBlendSpan);

                for (let x = xStart; x <= xEnd; x++) {
                    let idx = (y * w + x) * 4;
                    let alpha = 1.0;

                    if (x < cutL + totalBlendSpan) {
                        let t = (x - (cutL - totalBlendSpan)) / (2 * totalBlendSpan + 1);
                        alpha = getBlendAlpha(t, curveType, x, y);
                    } else if (x > cutR - totalBlendSpan) {
                        let t = ((cutR + totalBlendSpan) - x) / (2 * totalBlendSpan + 1);
                        alpha = getBlendAlpha(t, curveType, x, y);
                    }

                    for (let c = 0; c < 3; c++) {
                        pixels[idx + c] = pixels[idx + c] * (1 - alpha) + refPixels[idx + c] * alpha;
                    }
                }
            }

            copyPixels.set(pixels);
            let minY_T = Math.max(1, offY - bandH);
            let height_T = Math.max(2, offY - minY_T);
            let seamT = computeDPPath(copyPixels, refPixels, w, h, minY_T, height_T, gradWeight, stiffness, metric, 'horizontal');

            let minY_B = offY;
            let height_B = Math.min(h - offY - 2, bandH);
            let seamB = computeDPPath(copyPixels, refPixels, w, h, minY_B, height_B, gradWeight, stiffness, metric, 'horizontal');

            for (let x = 0; x < w; x++) {
                let wave = getWarpOffset(x, warpMode, warpAmp, warpFreq, warpJitter);
                seamT[x] = Math.max(0, Math.min(height_T - 1, seamT[x] + wave));
                seamB[x] = Math.max(0, Math.min(height_B - 1, seamB[x] - wave));
            }

            for (let x = 0; x < w; x++) {
                let cutT = minY_T + seamT[x];
                let cutB = minY_B + seamB[x];

                let yStart = Math.max(0, cutT - totalBlendSpan);
                let yEnd = Math.min(h - 1, cutB + totalBlendSpan);

                for (let y = yStart; y <= yEnd; y++) {
                    let idx = (y * w + x) * 4;
                    let alpha = 1.0;

                    if (y < cutT + totalBlendSpan) {
                        let t = (y - (cutT - totalBlendSpan)) / (2 * totalBlendSpan + 1);
                        alpha = getBlendAlpha(t, curveType, x, y);
                    } else if (y > cutB - totalBlendSpan) {
                        let t = ((cutB + totalBlendSpan) - y) / (2 * totalBlendSpan + 1);
                        alpha = getBlendAlpha(t, curveType, x, y);
                    }

                    for (let c = 0; c < 3; c++) {
                        pixels[idx + c] = pixels[idx + c] * (1 - alpha) + refPixels[idx + c] * alpha;
                    }
                }
            }

            tilingLastSeams = { seamL, seamR, seamT, seamB, minX_L, minX_R, minY_T, minY_B };
        }

        function applyCosineFeather(pixels, w, h, sx, sy) {
            let blendW = Math.floor(w * 0.15);
            let ref = new Uint8ClampedArray(pixels);
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let dx = Math.abs(x - sx), dy = Math.abs(y - sy);
                    if (dx < blendW || dy < blendW) {
                        let idx = (y * w + x) * 4;
                        let aX = dx < blendW ? 0.5 * (1 + Math.cos(Math.PI * (dx / blendW))) : 0;
                        let aY = dy < blendW ? 0.5 * (1 + Math.cos(Math.PI * (dy / blendW))) : 0;
                        let a = Math.max(aX, aY);
                        let refIdx = (((y + sy) % h) * w + ((x + sx) % w)) * 4;
                        for (let c = 0; c < 3; c++) {
                            pixels[idx + c] = pixels[idx + c] * (1 - a) + ref[refIdx + c] * a;
                        }
                    }
                }
            }
        }

        function applyFlatField(pixels, w, h) {
            let str = parseFloat(tilingState.flat_strength);
            for (let y = 0; y < h; y++) {
                let ny = (y - h/2)/(h/2);
                for (let x = 0; x < w; x++) {
                    let nx = (x - w/2)/(w/2);
                    let idx = (y * w + x) * 4;
                    let illum = Math.max(0.2, 1.0 - (nx*nx + ny*ny) * 0.4);
                    for (let c = 0; c < 3; c++) {
                        pixels[idx + c] = Math.min(255, Math.max(0, pixels[idx + c] / (illum * str + (1 - str))));
                    }
                }
            }
        }

        function applyCyclicOffset(pctx, w, h, sx, sy) {
            let tmp = document.createElement('canvas');
            tmp.width = w; tmp.height = h;
            let tctx = tmp.getContext('2d');
            tctx.drawImage(pctx.canvas, 0, 0);

            pctx.clearRect(0, 0, w, h);
            pctx.drawImage(tmp, 0, 0, w - sx, h - sy, sx, sy, w - sx, h - sy);
            pctx.drawImage(tmp, w - sx, 0, sx, h - sy, 0, sy, sx, h - sy);
            pctx.drawImage(tmp, 0, h - sy, w - sx, sy, sx, 0, w - sx, sy);
            pctx.drawImage(tmp, w - sx, h - sy, sx, sy, 0, 0, sx, sy);
        }

        function applyToroidalPostFX(pixels, w, h) {
            let gain = parseFloat(tilingState.freq_gain);
            let rad = parseInt(tilingState.freq_radius);
            let sharp = parseFloat(tilingState.sharpen);
            let microContrast = parseFloat(tilingState.micro_contrast);
            let noise = parseFloat(tilingState.micro_noise) * 2.55;
            let noiseScale = tilingState.micro_noise_scale;

            let copy = new Uint8ClampedArray(pixels);

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let idx = (y * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        let val = copy[idx + c];

                        if (gain > 1.0) {
                            let blurVal = (
                                getPixelWrapped(copy, w, h, x - rad, y, c) +
                                getPixelWrapped(copy, w, h, x + rad, y, c) +
                                getPixelWrapped(copy, w, h, x, y - rad, c) +
                                getPixelWrapped(copy, w, h, x, y + rad, c)
                            ) / 4;
                            val += (val - blurVal) * (gain - 1.0);
                        }

                        if (sharp > 0) {
                            let neighbors = (
                                getPixelWrapped(copy, w, h, x, y - 1, c) +
                                getPixelWrapped(copy, w, h, x, y + 1, c) +
                                getPixelWrapped(copy, w, h, x - 1, y, c) +
                                getPixelWrapped(copy, w, h, x + 1, y, c)
                            ) / 4;
                            val += (val - neighbors) * sharp;
                        }

                        if (microContrast !== 1.0) {
                            val = 128 + (val - 128) * microContrast;
                        }

                        if (noise > 0) {
                            let scaleFactor = noiseScale === 'fine' ? 1 : noiseScale === 'medium' ? 2 : 4;
                            let wx = Math.floor(x / scaleFactor);
                            let wy = Math.floor(y / scaleFactor);
                            let rnd = (pseudoNoise(wx, wy) - 0.5) * noise;
                            val += rnd;
                        }

                        pixels[idx + c] = Math.min(255, Math.max(0, val));
                    }
                }
            }
        }

        function enforceAdvancedToroidalGuard(pixels, w, h) {
            let guardW = parseInt(tilingState.guard_width || 16);
            let mixStr = parseInt(tilingState.guard_mix_strength || 85) / 100;
            let blendMode = tilingState.guard_blend_mode || tilingState.guard_curve || 'cosine';
            let jitterMax = parseInt(tilingState.guard_jitter || tilingState.guard_warp_amp || 8);
            let freq = parseFloat(tilingState.guard_frequency || tilingState.guard_warp_freq || 0.08);
            let preserveDetail = parseInt(tilingState.guard_detail_preserve || 70) / 100;

            let copy = new Uint8ClampedArray(pixels);

            // 1. Left-Right Boundary Blend
            for (let y = 0; y < h; y++) {
                let wave = Math.sin(y * freq) * jitterMax + (pseudoNoise(y, 19) - 0.5) * jitterMax;
                let effGuardW = Math.max(2, Math.round(guardW + wave));

                for (let x = 0; x < effGuardW; x++) {
                    let idxL = (y * w + x) * 4;
                    let idxR = (y * w + (w - 1 - x)) * 4;

                    let normT = x / effGuardW;
                    let alphaCurve = getBlendAlpha(1 - normT, blendMode, x, y);
                    let factor = 0.5 * alphaCurve * mixStr;

                    for (let c = 0; c < 3; c++) {
                        let valL = copy[idxL + c];
                        let valR = copy[idxR + c];

                        let newL = valL * (1 - factor) + valR * factor;
                        let newR = valR * (1 - factor) + valL * factor;

                        if (preserveDetail > 0) {
                            let detailL = valL - ((getPixelWrapped(copy, w, h, x-1, y, c) + getPixelWrapped(copy, w, h, x+1, y, c)) / 2);
                            let detailR = valR - ((getPixelWrapped(copy, w, h, w-1-x-1, y, c) + getPixelWrapped(copy, w, h, w-1-x+1, y, c)) / 2);
                            newL += detailL * preserveDetail * (1 - factor);
                            newR += detailR * preserveDetail * (1 - factor);
                        }

                        pixels[idxL + c] = Math.min(255, Math.max(0, Math.round(newL)));
                        pixels[idxR + c] = Math.min(255, Math.max(0, Math.round(newR)));
                    }
                }
            }

            copy.set(pixels);

            // 2. Top-Bottom Boundary Blend
            for (let x = 0; x < w; x++) {
                let wave = Math.sin(x * freq) * jitterMax + (pseudoNoise(x, 73) - 0.5) * jitterMax;
                let effGuardH = Math.max(2, Math.round(guardW + wave));

                for (let y = 0; y < effGuardH; y++) {
                    let idxT = (y * w + x) * 4;
                    let idxB = ((h - 1 - y) * w + x) * 4;

                    let normT = y / effGuardH;
                    let alphaCurve = getBlendAlpha(1 - normT, blendMode, x, y);
                    let factor = 0.5 * alphaCurve * mixStr;

                    for (let c = 0; c < 3; c++) {
                        let valT = copy[idxT + c];
                        let valB = copy[idxB + c];

                        let newT = valT * (1 - factor) + valB * factor;
                        let newB = valB * (1 - factor) + valT * factor;

                        if (preserveDetail > 0) {
                            let detailT = valT - ((getPixelWrapped(copy, w, h, x, y-1, c) + getPixelWrapped(copy, w, h, x, y+1, c)) / 2);
                            let detailB = valB - ((getPixelWrapped(copy, w, h, x, h-1-y-1, c) + getPixelWrapped(copy, w, h, x, h-1-y+1, c)) / 2);
                            newT += detailT * preserveDetail * (1 - factor);
                            newB += detailB * preserveDetail * (1 - factor);
                        }

                        pixels[idxT + c] = Math.min(255, Math.max(0, Math.round(newT)));
                        pixels[idxB + c] = Math.min(255, Math.max(0, Math.round(newB)));
                    }
                }
            }

            // 3. Toroidal Boundary Seam Edge Blur
            let guardBlurRad = parseInt(tilingState.guard_blur_radius || 0);
            if (guardBlurRad > 0) {
                applyToroidalBoundaryEdgeBlur(pixels, w, h, guardBlurRad);
            }
        }

        function applyToroidalBoundaryEdgeBlur(pixels, w, h, blurRadius) {
            if (blurRadius <= 0) return;
            let copy = new Uint8ClampedArray(pixels);
            let rad = Math.min(25, Math.round(blurRadius));

            function getBlurredVal(x, y, c) {
                let sum = 0, count = 0;
                let step = Math.max(1, Math.floor(rad / 4));
                for (let dy = -rad; dy <= rad; dy += step) {
                    for (let dx = -rad; dx <= rad; dx += step) {
                        let wx = (x + dx + w) % w;
                        let wy = (y + dy + h) % h;
                        sum += copy[(wy * w + wx) * 4 + c];
                        count++;
                    }
                }
                return count > 0 ? sum / count : copy[(y * w + x) * 4 + c];
            }

            for (let y = 0; y < h; y++) {
                for (let dx = 0; dx <= rad; dx++) {
                    let alpha = (1 - dx / (rad + 1)) * 0.6;
                    let idxL = (y * w + dx) * 4;
                    let idxR = (y * w + (w - 1 - dx)) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurL = getBlurredVal(dx, y, c);
                        pixels[idxL + c] = Math.round(pixels[idxL + c] * (1 - alpha) + blurL * alpha);
                        let blurR = getBlurredVal(w - 1 - dx, y, c);
                        pixels[idxR + c] = Math.round(pixels[idxR + c] * (1 - alpha) + blurR * alpha);
                    }
                }
            }

            for (let x = 0; x < w; x++) {
                for (let dy = 0; dy <= rad; dy++) {
                    let alpha = (1 - dy / (rad + 1)) * 0.6;
                    let idxT = (dy * w + x) * 4;
                    let idxB = ((h - 1 - dy) * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurT = getBlurredVal(x, dy, c);
                        pixels[idxT + c] = Math.round(pixels[idxT + c] * (1 - alpha) + blurT * alpha);
                        let blurB = getBlurredVal(x, h - 1 - dy, c);
                        pixels[idxB + c] = Math.round(pixels[idxB + c] * (1 - alpha) + blurB * alpha);
                    }
                }
            }
        }

        function drawDebugSeams(pctx, w, h) {
            let s = tilingLastSeams;
            if (!s) return;
            pctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            for (let y = 0; y < h; y++) {
                pctx.fillRect(s.minX_L + s.seamL[y], y, 2, 1);
                pctx.fillRect(s.minX_R + s.seamR[y], y, 2, 1);
            }
            pctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
            for (let x = 0; x < w; x++) {
                pctx.fillRect(x, s.minY_T + s.seamT[x], 1, 2);
                pctx.fillRect(x, s.minY_B + s.seamB[x], 1, 2);
            }
        }

        function applyTilingStamp(tx, ty, sx, sy) {
            if (!tilingProcessedCanvas) return;
            let pctx = tilingProcessedCanvas.getContext('2d');
            let w = tilingProcessedCanvas.width;
            let h = tilingProcessedCanvas.height;
            if (w <= 0 || h <= 0) return;

            ensureTilingStampCanvas(w, h);
            let sctx = tilingStampCanvas.getContext('2d');

            let size = parseInt(tilingState.stamp_size);
            let opacity = parseInt(tilingState.stamp_opacity) / 100;
            let softness = parseInt(tilingState.stamp_softness) / 100;

            let baseTx = (Math.floor(tx) % w + w) % w;
            let baseTy = (Math.floor(ty) % h + h) % h;
            let baseSx = (Math.floor(sx) % w + w) % w;
            let baseSy = (Math.floor(sy) % h + h) % h;

            if (tilingState.stamp_mode === 'erase') {
                let tempCanvas = document.createElement('canvas');
                tempCanvas.width = size * 2;
                tempCanvas.height = size * 2;
                let tCtx = tempCanvas.getContext('2d');

                let grad = tCtx.createRadialGradient(size, size, Math.max(0.1, size * (1 - softness)), size, size, size);
                grad.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                tCtx.fillStyle = grad;
                tCtx.beginPath();
                tCtx.arc(size, size, size, 0, Math.PI * 2);
                tCtx.fill();

                sctx.save();
                sctx.globalCompositeOperation = 'destination-out';
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let dx = baseTx - size + i * w;
                        let dy = baseTy - size + j * h;
                        sctx.drawImage(tempCanvas, dx, dy);
                    }
                }
                sctx.restore();
                runTilingPipeline();
                return;
            }

            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = size * 2;
            tempCanvas.height = size * 2;
            let tCtx = tempCanvas.getContext('2d');

            tCtx.save();
            tCtx.translate(size - baseSx, size - baseSy);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    tCtx.drawImage(tilingProcessedCanvas, i * w, j * h);
                }
            }
            tCtx.restore();

            tCtx.globalCompositeOperation = 'destination-in';
            let grad = tCtx.createRadialGradient(size, size, Math.max(0.1, size * (1 - softness)), size, size, size);
            grad.addColorStop(0, 'rgba(0,0,0,1)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            tCtx.fillStyle = grad;
            tCtx.beginPath();
            tCtx.arc(size, size, size, 0, Math.PI * 2);
            tCtx.fill();

            pctx.globalAlpha = opacity;
            sctx.globalAlpha = opacity;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let dx = baseTx - size + i * w;
                    let dy = baseTy - size + j * h;
                    pctx.drawImage(tempCanvas, dx, dy);
                    sctx.drawImage(tempCanvas, dx, dy);
                }
            }
            pctx.globalAlpha = 1.0;
            sctx.globalAlpha = 1.0;
        }

        function applyTilingMaskBrush(tx, ty) {
            if (!tilingOriginalCanvas) return;
            let w = tilingOriginalCanvas.width;
            let h = tilingOriginalCanvas.height;
            if (w <= 0 || h <= 0) return;

            ensureTilingMaskCanvas(w, h);
            let mctx = tilingMaskCanvas.getContext('2d');

            let size = parseInt(tilingState.mask_brush_size || 30);
            let opacity = parseInt(tilingState.mask_brush_opacity || 80) / 100;
            let softness = parseInt(tilingState.mask_brush_softness || 60) / 100;
            let mode = tilingState.mask_brush_mode || 'erase_seam';

            let baseTx = (Math.floor(tx) % w + w) % w;
            let baseTy = (Math.floor(ty) % h + h) % h;

            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = size * 2;
            tempCanvas.height = size * 2;
            let tCtx = tempCanvas.getContext('2d');

            let grad = tCtx.createRadialGradient(size, size, Math.max(0.1, size * (1 - softness)), size, size, size);
            grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            tCtx.fillStyle = grad;
            tCtx.beginPath();
            tCtx.arc(size, size, size, 0, Math.PI * 2);
            tCtx.fill();

            mctx.save();
            if (mode === 'erase_seam') {
                mctx.globalCompositeOperation = 'source-over';
            } else {
                mctx.globalCompositeOperation = 'destination-out';
            }

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let dx = baseTx - size + i * w;
                    let dy = baseTy - size + j * h;
                    mctx.drawImage(tempCanvas, dx, dy);
                }
            }
            mctx.restore();
        }

        function applySeamEdgeBlur(pixels, w, h, blurRadius) {
            if (blurRadius <= 0 || !tilingLastSeams) return;
            let s = tilingLastSeams;
            let copy = new Uint8ClampedArray(pixels);
            let rad = Math.min(25, Math.round(blurRadius));

            function getBlurredVal(x, y, c) {
                let sum = 0, count = 0;
                let step = Math.max(1, Math.floor(rad / 4));
                for (let dy = -rad; dy <= rad; dy += step) {
                    for (let dx = -rad; dx <= rad; dx += step) {
                        let wx = (x + dx % w + w) % w;
                        let wy = (y + dy % h + h) % h;
                        sum += copy[(wy * w + wx) * 4 + c];
                        count++;
                    }
                }
                return count > 0 ? sum / count : copy[(y * w + x) * 4 + c];
            }

            for (let y = 0; y < h; y++) {
                let cutL = s.minX_L + (s.seamL[y] || 0);
                let cutR = s.minX_R + (s.seamR[y] || 0);

                for (let dx = -rad; dx <= rad; dx++) {
                    let xL = (cutL + dx + w) % w;
                    let dist = Math.abs(dx) / (rad || 1);
                    let alpha = Math.max(0, 1 - dist) * 0.7;
                    let idxL = (y * w + xL) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurV = getBlurredVal(xL, y, c);
                        pixels[idxL + c] = Math.round(pixels[idxL + c] * (1 - alpha) + blurV * alpha);
                    }

                    let xR = (cutR + dx + w) % w;
                    let idxR = (y * w + xR) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurV = getBlurredVal(xR, y, c);
                        pixels[idxR + c] = Math.round(pixels[idxR + c] * (1 - alpha) + blurV * alpha);
                    }
                }
            }

            for (let x = 0; x < w; x++) {
                let cutT = s.minY_T + (s.seamT[x] || 0);
                let cutB = s.minY_B + (s.seamB[x] || 0);

                for (let dy = -rad; dy <= rad; dy++) {
                    let yT = (cutT + dy + h) % h;
                    let dist = Math.abs(dy) / (rad || 1);
                    let alpha = Math.max(0, 1 - dist) * 0.7;
                    let idxT = (yT * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurV = getBlurredVal(x, yT, c);
                        pixels[idxT + c] = Math.round(pixels[idxT + c] * (1 - alpha) + blurV * alpha);
                    }

                    let yB = (cutB + dy + h) % h;
                    let idxB = (yB * w + x) * 4;
                    for (let c = 0; c < 3; c++) {
                        let blurV = getBlurredVal(x, yB, c);
                        pixels[idxB + c] = Math.round(pixels[idxB + c] * (1 - alpha) + blurV * alpha);
                    }
                }
            }
        }

        function runTilingPipeline(skipDraw = false) {
            if (!tilingState.hasImage || !tilingOriginalCanvas) return;
            let t0 = performance.now();
            let w = tilingOriginalCanvas.width;
            let h = tilingOriginalCanvas.height;
            if (w <= 0 || h <= 0) return;

            if (!tilingProcessedCanvas) {
                tilingProcessedCanvas = document.createElement('canvas');
            }
            tilingProcessedCanvas.width = w;
            tilingProcessedCanvas.height = h;

            let pctx = tilingProcessedCanvas.getContext('2d');
            pctx.drawImage(tilingOriginalCanvas, 0, 0);

            if (!tilingState.enabled) {
                let badge = $('tilingStatusBadge');
                if (badge) badge.innerText = `Вимкнено (оригінал)`;
                if (!skipDraw && currentTab === 'tiling') {
                    renderTilingView();
                }
                return;
            }

            let imgData = pctx.getImageData(0, 0, w, h);
            let pixels = imgData.data;

            if (tilingState.luma_balance_enable) {
                applyCyclicLumaBalance(pixels, w, h);
            }

            if (tilingState.flat_enable) {
                applyFlatField(pixels, w, h);
            }

            pctx.putImageData(imgData, 0, 0);

            let offX = Math.floor(w * (parseInt(tilingState.offset_x) / 100));
            let offY = Math.floor(h * (parseInt(tilingState.offset_y) / 100));
            applyCyclicOffset(pctx, w, h, offX, offY);

            imgData = pctx.getImageData(0, 0, w, h);
            pixels = imgData.data;

            let algo = tilingState.seam_algo;
            if (algo.startsWith('dp')) {
                applyOpticalDynamicSeamEngine(pixels, w, h, offX, offY);
            } else {
                applyCosineFeather(pixels, w, h, offX, offY);
            }

            if (tilingState.seam_blur_radius > 0) {
                applySeamEdgeBlur(pixels, w, h, parseInt(tilingState.seam_blur_radius));
            }

            applyToroidalPostFX(pixels, w, h);

            if (tilingState.guard_enable) {
                enforceAdvancedToroidalGuard(pixels, w, h);
            }

            pctx.putImageData(imgData, 0, 0);

            if (tilingMaskCanvas && tilingMaskCanvas.width === w && tilingMaskCanvas.height === h) {
                let maskTemp = document.createElement('canvas');
                maskTemp.width = w; maskTemp.height = h;
                let mctx = maskTemp.getContext('2d');
                mctx.drawImage(tilingOriginalCanvas, 0, 0);
                mctx.globalCompositeOperation = 'destination-in';
                mctx.drawImage(tilingMaskCanvas, 0, 0);

                pctx.drawImage(maskTemp, 0, 0);
            }

            if (tilingStampCanvas && tilingStampCanvas.width === w && tilingStampCanvas.height === h) {
                pctx.drawImage(tilingStampCanvas, 0, 0);
            }

            if (tilingState.showSeams && tilingLastSeams) {
                drawDebugSeams(pctx, w, h);
            }

            let t1 = performance.now();
            let badge = $('tilingStatusBadge');
            if (badge) badge.innerText = `Оброблено за ${(t1 - t0).toFixed(1)} мс`;

            if (!skipDraw && currentTab === 'tiling') {
                renderTilingView();
            }
        }

        function renderTilingView() {
            if (!canvas) return;
            let cx = canvas.getContext('2d');
            if (!tilingProcessedCanvas || !tilingState.hasImage) {
                canvas.width = canvasResolution;
                canvas.height = canvasResolution;
                cx.fillStyle = '#0f0f11';
                cx.fillRect(0, 0, canvas.width, canvas.height);
                cx.fillStyle = '#9ca3af';
                cx.font = '14px sans-serif';
                cx.textAlign = 'center';
                cx.fillText('Немає текстури для тайлінгу. Отримайте з проєкту або завантажте.', canvas.width/2, canvas.height/2);
                return;
            }

            let w = tilingProcessedCanvas.width;
            let h = tilingProcessedCanvas.height;
            let m = tilingState.currentViewMode;
            let showGrid = tilingState.showGrid;

            if (m === 'single') {
                canvas.width = w; canvas.height = h;
                cx.drawImage(tilingProcessedCanvas, 0, 0);
            } else if (m === 'original') {
                canvas.width = tilingOriginalCanvas.width; canvas.height = tilingOriginalCanvas.height;
                cx.drawImage(tilingOriginalCanvas, 0, 0);
            } else if (m === 'tiled') {
                canvas.width = w * 2; canvas.height = h * 2;
                cx.drawImage(tilingProcessedCanvas, 0, 0, w, h);
                cx.drawImage(tilingProcessedCanvas, w, 0, w, h);
                cx.drawImage(tilingProcessedCanvas, 0, h, w, h);
                cx.drawImage(tilingProcessedCanvas, w, h, w, h);

                if (showGrid) {
                    cx.strokeStyle = 'rgba(59, 130, 246, 0.8)'; cx.lineWidth = 2;
                    cx.beginPath();
                    cx.moveTo(w, 0); cx.lineTo(w, h * 2); cx.moveTo(0, h); cx.lineTo(w * 2, h);
                    cx.stroke();
                }
            } else if (m === 'tiled3') {
                canvas.width = w * 3; canvas.height = h * 3;
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        cx.drawImage(tilingProcessedCanvas, c * w, r * h, w, h);
                    }
                }
                if (showGrid) {
                    cx.strokeStyle = 'rgba(59, 130, 246, 0.8)'; cx.lineWidth = 2;
                    cx.beginPath();
                    cx.moveTo(w, 0); cx.lineTo(w, h * 3); cx.moveTo(w * 2, 0); cx.lineTo(w * 2, h * 3);
                    cx.moveTo(0, h); cx.lineTo(w * 3, h); cx.moveTo(0, h * 2); cx.lineTo(w * 3, h * 2);
                    cx.stroke();
                }
            }

            if ($('resolutionInfo')) {
                $('resolutionInfo').textContent = `${w} × ${h} (Тайлінг ${m})`;
            }

            if ((tilingState.stamp_enable || tilingState.mask_brush_enable) && m !== 'original') {
                let size = tilingState.stamp_enable ? parseInt(tilingState.stamp_size) : parseInt(tilingState.mask_brush_size);

                if (stampCursorX > -9999) {
                    cx.beginPath();
                    cx.arc(stampCursorX, stampCursorY, size, 0, Math.PI * 2);
                    let color = tilingState.mask_brush_enable ? 'rgba(168, 85, 247, 0.9)' : (tilingState.stamp_mode === 'erase' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 255, 255, 0.9)');
                    cx.strokeStyle = color;
                    cx.lineWidth = 1.5;
                    cx.stroke();
                    cx.beginPath();
                    cx.arc(stampCursorX, stampCursorY, size, 0, Math.PI * 2);
                    cx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
                    cx.lineWidth = 1;
                    cx.setLineDash([4, 4]);
                    cx.stroke();
                    cx.setLineDash([]);
                }

                if (tilingState.stamp_enable && stampSource && tilingState.stamp_mode !== 'erase') {
                    let sX = stampSource.x;
                    let sY = stampSource.y;

                    cx.beginPath();
                    cx.arc(sX, sY, size, 0, Math.PI * 2);
                    cx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
                    cx.lineWidth = 1.5;
                    cx.stroke();

                    cx.beginPath();
                    cx.moveTo(sX - 4, sY); cx.lineTo(sX + 4, sY);
                    cx.moveTo(sX, sY - 4); cx.lineTo(sX, sY + 4);
                    cx.stroke();
                }
            }
        }

        function renderTilingPanel() {
            let t = tilingState;
            let acc = t.accordions;
            let toggleAcc = (key) => `onclick="toggleTilingAccordion('${key}')"`;
            let isAccOpen = (key) => acc[key] ? 'show' : '';
            let isAccChev = (key) => acc[key] ? 'open' : '';

            let panel = $('propertiesPanel');
            if (!panel) return;

            panel.innerHTML = `
                <div class="sidebar-section" style="background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3); padding: 10px; border-radius: 8px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <div>
                            <div style="font-weight: 700; font-size: 13px; color: #3b82f6;">🔁 Активний безшовний тайлінг</div>
                            <div style="font-size: 10.5px; color: var(--text-muted, #a1a1aa);">Застосовує тайлінг до всього канвасу live</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="chkEnableTiling" ${t.enabled ? 'checked' : ''} onchange="toggleEnableTiling(this.checked)">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div style="font-size:10px; color:${t.customImageLoaded ? '#f59e0b' : '#10b981'}; background:rgba(0,0,0,0.2); padding:4px 8px; border-radius:4px; display:flex; align-items:center; justify-content:space-between;">
                        <span>${t.customImageLoaded ? '📁 Власне фото' : '⚡ Live Canvas (з проєкту)'}</span>
                        ${t.customImageLoaded ? `<button onclick="tilingState.customImageLoaded=false; requestRender(); renderTilingPanel();" style="background:none; border:none; color:#3b82f6; text-decoration:underline; font-size:10px; cursor:pointer; padding:0;">Повернути live проєкт</button>` : ''}
                    </div>
                </div>

                <div class="property-group" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px;">
                    <button onclick="$('tilingImageInput').click()" class="btn btn-secondary" style="font-size:11px; padding:6px 4px;" title="Завантажити власне фото для тайлінгу">📂 Завантажити</button>
                    <button onclick="applyTilingToLayer()" class="btn btn-secondary" style="font-size:11px; padding:6px 4px;" title="Створити новий Paint шар з цим безшовним талом">🎨 У новий шар</button>
                    <button onclick="openTilingExportModal()" class="btn btn-success" style="font-size:11px; padding:6px 4px;" title="Зберегти PNG зображення">💾 Зберегти PNG</button>
                </div>

                <div class="property-group">
                    <button onclick="resetTilingToDefaults()" class="btn btn-secondary" style="width:100%; font-size:11px;" title="Скинути всі налаштування тайлінгу">🔄 Скинути параметри тайлінгу</button>
                    <div style="font-size:11px; color:var(--text-muted, #a1a1aa); margin-top:4px; text-align:center;">
                        Експериментальна функція.<br>Функція може працювати дивно.
                    </div>
                </div>

                <hr>

                <div class="sidebar-section">
                    <div class="section-title">📦 Професійні Пресети</div>
                    <div class="control-group">
                        <select id="presetSelect" onchange="applyTilingPreset(this.value)" class="form-control">
                            <option value="organic" ${t.preset==='organic'?'selected':''}>Органіка (Камінь, Земля, Трава)</option>
                            <option value="pattern" ${t.preset==='pattern'?'selected':''}>Геометрія / Плитка / Бруківка</option>
                            <option value="wood" ${t.preset==='wood'?'selected':''}>Дерево / Текстиль</option>
                            <option value="micro" ${t.preset==='micro'?'selected':''}>Максимальні деталі (Micro-Highpass)</option>
                        </select>
                    </div>
                </div>

                <hr>

                <div class="sidebar-section">
                    <div class="section-title">👁️ Режим перегляду</div>
                    <div class="gen-grid" style="grid-template-columns:repeat(4,1fr); gap:4px; margin-bottom:8px;">
                        <button class="gen-btn ${t.currentViewMode==='single'?'active':''}" onclick="setViewModeTiling('single')">1x1</button>
                        <button class="gen-btn ${t.currentViewMode==='tiled'?'active':''}" onclick="setViewModeTiling('tiled')">2x2 Grid</button>
                        <button class="gen-btn ${t.currentViewMode==='tiled3'?'active':''}" onclick="setViewModeTiling('tiled3')">3x3 Grid</button>
                        <button class="gen-btn ${t.currentViewMode==='original'?'active':''}" onclick="setViewModeTiling('original')">Оригінал</button>
                    </div>
                    <div class="toggle-row">
                        <span style="font-size:11px;">📐 Лінії сітки:</span>
                        <label class="switch"><input type="checkbox" ${t.showGrid?'checked':''} onchange="tilingState.showGrid=this.checked; renderTilingView();"><span class="slider"></span></label>
                    </div>
                    <div id="tilingStatusBadge" style="font-size:10px; color:var(--accent-green, #10b981); font-family:monospace; margin-top:4px;">
                        ${t.hasImage ? 'Готовий' : 'Очікування зображення...'}
                    </div>
                </div>

                <hr>

                <!-- 1. ШТАМП -->
                <div class="sidebar-section" style="background-color: rgba(6, 182, 212, 0.08); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('stamp')}>
                        <span class="section-title" style="color: #06b6d4; margin:0; border:none;"><span class="algo-badge" style="background: rgba(6, 182, 212, 0.2); color: #06b6d4;">🖌️ STAMP</span> Інструмент Штамп</span>
                        <span class="chevron ${isAccChev('stamp')}" id="acc_tiling_stamp_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('stamp')}" id="acc_tiling_stamp">
                        <div class="toggle-row" style="margin-bottom: 6px;">
                            <span style="font-weight: 600;">Увімкнути Штамп</span>
                            <label class="switch"><input type="checkbox" id="stamp_enable" ${t.stamp_enable?'checked':''} onchange="toggleTilingStamp(this.checked)"><span class="slider"></span></label>
                        </div>

                        <div class="control-group" style="margin-bottom:8px;">
                            <label class="control-label">Режим штампу:</label>
                            <div class="gen-grid" style="grid-template-columns: 1fr 1fr; gap: 4px;">
                                <button type="button" class="gen-btn ${t.stamp_mode !== 'erase' ? 'active' : ''}" onclick="tilingState.stamp_mode='clone'; renderTilingPanel();">🎯 Клон (Clone)</button>
                                <button type="button" class="gen-btn ${t.stamp_mode === 'erase' ? 'active' : ''}" onclick="tilingState.stamp_mode='erase'; renderTilingPanel();">🧹 Стерти (Eraser)</button>
                            </div>
                        </div>

                        ${t.stamp_mode !== 'erase' ? `
                            <div class="toggle-row" style="margin-bottom: 8px;">
                                <span style="font-size:11px;">Переміщати джерело (Aligned):</span>
                                <label class="switch"><input type="checkbox" ${t.stamp_aligned?'checked':''} onchange="tilingState.stamp_aligned=this.checked; renderTilingPanel();"><span class="slider"></span></label>
                            </div>

                            <button onclick="toggleSelectingStampSource()" class="btn ${selectingStampSource ? 'btn-primary' : 'btn-secondary'}" style="width:100%; margin-bottom:8px; font-size:11px; padding:6px 8px; display:flex; align-items:center; justify-content:center; gap:6px;">
                                <span>🎯</span>
                                <span>${selectingStampSource ? 'Клікніть на полотні для вибору точки' : 'Обрати точку джерела (зразка)'}</span>
                            </button>

                            ${selectingStampSource ? `
                                <div style="background: rgba(6, 182, 212, 0.2); color: #06b6d4; font-size:11px; padding:6px; border-radius:4px; margin-bottom:8px; text-align:center; font-weight:600;">
                                    👉 Торкніться або клікніть у будь-якому місці текстури, щоб встановити маркер зразка.
                                </div>
                            ` : `
                                <div class="hint-text" style="margin-bottom:8px;">
                                    <b>Підказка:</b> Натисніть кнопку вище або затисніть <b>SHIFT / ALT</b> і торкніться полотна.
                                </div>
                            `}
                        ` : ''}

                        ${tilingSlider("Розмір пензля", "stamp_size", 5, 200, 1, "px", 30)}
                        ${tilingSlider("Непрозорість", "stamp_opacity", 1, 100, 1, "%", 80)}
                        ${tilingSlider("М'якість країв", "stamp_softness", 0, 100, 1, "%", 60)}

                        <button type="button" class="btn btn-secondary" style="width:100%; margin-top:8px; color:#ef4444; border-color:rgba(239,68,68,0.3); font-size:11px;" onclick="clearTilingStampCanvas(); runTilingPipeline(); commitHistorySnapshot();">🗑️ Очистити штрихи штампу</button>
                    </div>
                </div>

                <!-- 1b. ТАЙЛІНГ СТЕРТИ / ВІДНОВИТИ -->
                <div class="sidebar-section" style="background-color: rgba(168, 85, 247, 0.08); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('mask')}>
                        <span class="section-title" style="color: #a855f7; margin:0; border:none;"><span class="algo-badge" style="background: rgba(168, 85, 247, 0.2); color: #a855f7;">✨ MASK</span> Стерти / Відновити стики</span>
                        <span class="chevron ${isAccChev('mask')}" id="acc_tiling_mask_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('mask')}" id="acc_tiling_mask">
                        <div class="toggle-row" style="margin-bottom: 6px;">
                            <span style="font-weight: 600;">Увімкнути Пензель стиків</span>
                            <label class="switch"><input type="checkbox" id="mask_brush_enable" ${t.mask_brush_enable?'checked':''} onchange="toggleTilingMaskBrush(this.checked)"><span class="slider"></span></label>
                        </div>
                        <div class="control-group" style="margin-bottom:8px;">
                            <label class="control-label">Дія пензля:</label>
                            <div class="gen-grid" style="grid-template-columns: 1fr 1fr; gap: 4px;">
                                <button type="button" class="gen-btn ${t.mask_brush_mode==='erase_seam'?'active':''}" onclick="tilingState.mask_brush_mode='erase_seam'; renderTilingPanel();">👁️ Проявити нижні (Стерти стик)</button>
                                <button type="button" class="gen-btn ${t.mask_brush_mode==='restore_seam'?'active':''}" onclick="tilingState.mask_brush_mode='restore_seam'; renderTilingPanel();">🛡️ Перекрити (Відновити тайл)</button>
                            </div>
                        </div>
                        ${tilingSlider("Розмір пензля", "mask_brush_size", 5, 200, 1, "px", 30)}
                        ${tilingSlider("Непрозорість", "mask_brush_opacity", 1, 100, 1, "%", 80)}
                        ${tilingSlider("М'якість країв", "mask_brush_softness", 0, 100, 1, "%", 60)}
                        <button type="button" class="btn btn-secondary" style="width:100%; margin-top:8px; color:#ef4444; border-color:rgba(239,68,68,0.3); font-size:11px;" onclick="clearTilingMaskCanvas(); runTilingPipeline(); commitHistorySnapshot();">🗑️ Очистити маску стиків</button>
                    </div>
                </div>

                <!-- 2. TOROIDAL GUARD v9.0 -->
                <div class="sidebar-section" style="background-color: rgba(16, 185, 129, 0.08); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('guard')}>
                        <span class="section-title" style="color: #10b981; margin:0; border:none;"><span class="algo-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">★ ADVANCED</span> Toroidal Guard v9.0</span>
                        <span class="chevron ${isAccChev('guard')}" id="acc_tiling_guard_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('guard')}" id="acc_tiling_guard">
                        <div class="toggle-row">
                            <span>Гарантія безшовності стиків</span>
                            <label class="switch"><input type="checkbox" ${t.guard_enable?'checked':''} onchange="tilingState.guard_enable=this.checked; runTilingPipeline();"><span class="slider"></span></label>
                        </div>
                        ${tilingSlider("Ширина зони", "guard_width", 2, 60, 1, "px", 16)}
                        ${tilingSlider("Сила змішування", "guard_mix_strength", 0, 100, 1, "%", 85)}
                        <div class="control-group">
                            <label class="control-label">Алгоритм генерації стиків країв:</label>
                            <select class="form-control" onchange="tilingState.guard_seam_algo=this.value; runTilingPipeline();">
                                <option value="dp_mincost" ${t.guard_seam_algo==='dp_mincost'?'selected':''}>DP Dual-Cut Graph (Мінімальна вартість)</option>
                                <option value="cosine" ${t.guard_seam_algo==='cosine'?'selected':''}>Cosine Feather (Плавне згасання)</option>
                                <option value="smoothstep" ${t.guard_seam_algo==='smoothstep'?'selected':''}>Smoothstep S-Curve</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label class="control-label">Метрика кольору країв:</label>
                            <select class="form-control" onchange="tilingState.guard_seam_metric=this.value; runTilingPipeline();">
                                <option value="lab" ${t.guard_seam_metric==='lab'?'selected':''}>CIELAB Perceptual (Перцептивна)</option>
                                <option value="rgb" ${t.guard_seam_metric==='rgb'?'selected':''}>RGB Euclidean</option>
                                <option value="sobel" ${t.guard_seam_metric==='sobel'?'selected':''}>Sobel Gradient (Структурні ребра)</option>
                                <option value="luma" ${t.guard_seam_metric==='luma'?'selected':''}>Luminance Only</option>
                            </select>
                        </div>
                        ${tilingSlider("Зона пошуку шва країв", "guard_search", 5, 50, 1, "px", 15)}
                        ${tilingSlider("Жорсткість лінії шва країв", "guard_stiffness", 0.1, 3.0, 0.1, "", 1.2)}
                        ${tilingSlider("Вага градієнта країв", "guard_grad_weight", 0.1, 5.0, 0.1, "", 2.0)}
                        <div class="control-group">
                            <label class="control-label">Режим деформації країв:</label>
                            <select class="form-control" onchange="tilingState.guard_warp_mode=this.value; runTilingPipeline();">
                                <option value="chaotic" ${t.guard_warp_mode==='chaotic'?'selected':''}>Chaotic Noise (Хаотична шумова)</option>
                                <option value="sine" ${t.guard_warp_mode==='sine'?'selected':''}>Sine Wave (Синусоїдальна)</option>
                                <option value="perlin" ${t.guard_warp_mode==='perlin'?'selected':''}>Perlin Noise (Фрактальна)</option>
                                <option value="stochastic" ${t.guard_warp_mode==='stochastic'?'selected':''}>Stochastic Dither (Стохастична)</option>
                                <option value="none" ${t.guard_warp_mode==='none'?'selected':''}>None (Пряма лінія)</option>
                            </select>
                        </div>
                        ${tilingSlider("Амплітуда деформації країв", "guard_warp_amp", 0, 30, 1, "px", 8)}
                        ${tilingSlider("Частота деформації країв", "guard_warp_freq", 0.01, 0.30, 0.01, "", 0.08)}
                        <div class="control-group">
                            <label class="control-label">Крива згладжування країв:</label>
                            <select class="form-control" onchange="tilingState.guard_blend_mode=this.value; runTilingPipeline();">
                                <option value="cosine" ${t.guard_blend_mode==='cosine'?'selected':''}>Cosine Feather</option>
                                <option value="sigmoid" ${t.guard_blend_mode==='sigmoid'?'selected':''}>Sigmoid S-Curve</option>
                                <option value="exponential" ${t.guard_blend_mode==='exponential'?'selected':''}>Exponential</option>
                                <option value="stochastic" ${t.guard_blend_mode==='stochastic'?'selected':''}>Stochastic Dither</option>
                                <option value="gaussian" ${t.guard_blend_mode==='gaussian'?'selected':''}>Gaussian Bell Curve</option>
                                <option value="smoothstep" ${t.guard_blend_mode==='smoothstep'?'selected':''}>Smoothstep</option>
                            </select>
                        </div>
                        ${tilingSlider("Зона перекриття країв", "guard_overlap", 2, 60, 1, "px", 14)}
                        ${tilingSlider("Згладжування стику (Feather)", "guard_feather", 0, 30, 1, "px", 8)}
                        ${tilingSlider("Розмиття країв гарантованого стику", "guard_blur_radius", 0, 30, 1, "px", 8)}
                        ${tilingSlider("Розсіювання шва (Jitter)", "guard_jitter", 0, 30, 1, "px", 8)}
                        ${tilingSlider("Частота вигину", "guard_frequency", 0.01, 0.30, 0.01, "", 0.08)}
                        ${tilingSlider("Збереження деталей", "guard_detail_preserve", 0, 100, 1, "%", 70)}
                    </div>
                </div>

                <!-- 3. OPTICAL DYNAMIC SEAM ENGINE -->
                <div class="sidebar-section" style="background-color: rgba(59, 130, 246, 0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('dp')}>
                        <span class="section-title" style="color: #3b82f6; margin:0; border:none;"><span class="algo-badge">DP</span> Optical Dynamic Seam Engine</span>
                        <span class="chevron ${isAccChev('dp')}" id="acc_tiling_dp_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('dp')}" id="acc_tiling_dp">
                        <div class="toggle-row" style="background: rgba(239, 68, 68, 0.1); padding: 4px 6px; border-radius: 4px; margin-bottom: 8px;">
                            <span style="color: #fca5a5; font-weight: 600;">🔴 Показувати лінію розрізу</span>
                            <label class="switch"><input type="checkbox" ${t.showSeams?'checked':''} onchange="tilingState.showSeams=this.checked; runTilingPipeline();"><span class="slider"></span></label>
                        </div>
                        <div class="control-group">
                            <label class="control-label">Алгоритм генерації:</label>
                            <select class="form-control" onchange="tilingState.seam_algo=this.value; runTilingPipeline();">
                                <option value="dp_mincost" ${t.seam_algo==='dp_mincost'?'selected':''}>Optical Dynamic Dual-Cut Graph (DP)</option>
                                <option value="cosine" ${t.seam_algo==='cosine'?'selected':''}>Cosine Feather Soft Crossfade</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label class="control-label">Метрика порівняння кольору:</label>
                            <select class="form-control" onchange="tilingState.seam_metric=this.value; runTilingPipeline();">
                                <option value="lab" ${t.seam_metric==='lab'?'selected':''}>CIELAB Perceptual</option>
                                <option value="rgb" ${t.seam_metric==='rgb'?'selected':''}>RGB Euclidean</option>
                                <option value="sobel" ${t.seam_metric==='sobel'?'selected':''}>Sobel Gradient Magnitude</option>
                                <option value="luma" ${t.seam_metric==='luma'?'selected':''}>Luminance / Яскравість</option>
                            </select>
                        </div>
                        ${tilingSlider("Ширина зони пошуку", "seam_search", 5, 40, 1, "%", 20)}
                        ${tilingSlider("Жорсткість шва (Stiffness)", "seam_stiffness", 0.0, 4.0, 0.1, "", 1.2)}
                        ${tilingSlider("Вага градієнта (Деталі)", "seam_grad_weight", 0.0, 5.0, 0.2, "", 2.5)}
                    </div>
                </div>

                <!-- 4. WARP FX -->
                <div class="sidebar-section" style="background-color: rgba(139, 92, 246, 0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('warp')}>
                        <span class="section-title" style="color: #8b5cf6; margin:0; border:none;"><span class="algo-badge" style="background: rgba(139, 92, 246, 0.2); color: #8b5cf6;">FX</span> Деформація Границі</span>
                        <span class="chevron ${isAccChev('warp')}" id="acc_tiling_warp_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('warp')}" id="acc_tiling_warp">
                        <div class="control-group">
                            <label class="control-label">Режим деформації шва:</label>
                            <select class="form-control" onchange="tilingState.seam_warp_mode=this.value; runTilingPipeline();">
                                <option value="chaotic" ${t.seam_warp_mode==='chaotic'?'selected':''}>🌀 Chaotic Noise</option>
                                <option value="jitter" ${t.seam_warp_mode==='jitter'?'selected':''}>⚡ Jitter / Scattered</option>
                                <option value="fractal" ${t.seam_warp_mode==='fractal'?'selected':''}>❄️ Fractal Wave</option>
                                <option value="sine" ${t.seam_warp_mode==='sine'?'selected':''}>🌊 Sinusoidal Wave</option>
                            </select>
                        </div>
                        ${tilingSlider("Амплітуда деформації", "seam_warp_amp", 0, 40, 1, "px", 10)}
                        ${tilingSlider("Частота хвилі/шуму", "seam_warp_freq", 0.01, 0.30, 0.01, "", 0.06)}
                        ${tilingSlider("Розсіювання шва", "seam_warp_jitter", 0, 20, 1, "px", 4)}
                    </div>
                </div>

                <!-- 5. MIX BLEND & FEATHER -->
                <div class="sidebar-section" style="padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('blend')}>
                        <span class="section-title" style="margin:0; border:none;"><span class="algo-badge">MIX</span> Змішування та Згладжування</span>
                        <span class="chevron ${isAccChev('blend')}" id="acc_tiling_blend_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('blend')}" id="acc_tiling_blend">
                        <div class="control-group">
                            <label class="control-label">Крива блендингу:</label>
                            <select class="form-control" onchange="tilingState.seam_curve=this.value; runTilingPipeline();">
                                <option value="sigmoid" ${t.seam_curve==='sigmoid'?'selected':''}>📉 Sigmoid S-Curve</option>
                                <option value="gaussian" ${t.seam_curve==='gaussian'?'selected':''}>🔔 Gaussian Bell Curve</option>
                                <option value="dither" ${t.seam_curve==='dither'?'selected':''}>🎲 Dithered Stochastic Mask</option>
                                <option value="cosine" ${t.seam_curve==='cosine'?'selected':''}>〰️ Cosine Feather</option>
                                <option value="smoothstep" ${t.seam_curve==='smoothstep'?'selected':''}>S-Smoothstep</option>
                            </select>
                        </div>
                        ${tilingSlider("Розмиття країв шва (Edge Blur)", "seam_blur_radius", 0, 50, 1, "px", 12)}
                        ${tilingSlider("Згладжування стику (Feather)", "seam_feather", 0, 100, 1, "px", 8)}
                        ${tilingSlider("Зона перекриття (Overlap)", "seam_overlap", 0, 100, 1, "px", 14)}
                    </div>
                </div>

                <!-- 6. LUMA BALANCE -->
                <div class="sidebar-section" style="background-color: rgba(245, 158, 11, 0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('luma')}>
                        <span class="section-title" style="color: #f59e0b; margin:0; border:none;"><span class="algo-badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b;">LUMA</span> Вирівнювання Яскравості</span>
                        <span class="chevron ${isAccChev('luma')}" id="acc_tiling_luma_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('luma')}" id="acc_tiling_luma">
                        <div class="toggle-row">
                            <span>Баланс протилежних границь</span>
                            <label class="switch"><input type="checkbox" ${t.luma_balance_enable?'checked':''} onchange="tilingState.luma_balance_enable=this.checked; runTilingPipeline();"><span class="slider"></span></label>
                        </div>
                        ${tilingSlider("Сила компенсації", "luma_balance_strength", 0, 100, 1, "%", 75)}
                    </div>
                </div>

                <!-- 7. FLAT-FIELD LIGHT CORRECTION -->
                <div class="sidebar-section" style="padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('flat')}>
                        <span class="section-title" style="margin:0; border:none;"><span class="algo-badge">FLAT</span> Flat-Field Light Correction</span>
                        <span class="chevron ${isAccChev('flat')}" id="acc_tiling_flat_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('flat')}" id="acc_tiling_flat">
                        <div class="toggle-row">
                            <span>Корекція нерівності освітлення</span>
                            <label class="switch"><input type="checkbox" ${t.flat_enable?'checked':''} onchange="tilingState.flat_enable=this.checked; runTilingPipeline();"><span class="slider"></span></label>
                        </div>
                        ${tilingSlider("Сила корекції", "flat_strength", 0, 1, 0.05, "", 0.80)}
                    </div>
                </div>

                <!-- 8. CYCLIC OFFSET -->
                <div class="sidebar-section" style="padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('offset')}>
                        <span class="section-title" style="margin:0; border:none;"><span class="algo-badge">OFFSET</span> Cyclic Offset</span>
                        <span class="chevron ${isAccChev('offset')}" id="acc_tiling_offset_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('offset')}" id="acc_tiling_offset">
                        ${tilingSlider("X Offset", "offset_x", 0, 100, 1, "%", 50)}
                        ${tilingSlider("Y Offset", "offset_y", 0, 100, 1, "%", 50)}
                    </div>
                </div>

                <!-- 9. POST-FX MICRO-DETAILS -->
                <div class="sidebar-section" style="background-color: rgba(236, 72, 153, 0.05); padding:8px; border-radius:6px; margin-bottom:8px;">
                    <div class="section-header" ${toggleAcc('fx')}>
                        <span class="section-title" style="color: #ec4899; margin:0; border:none;"><span class="algo-badge" style="background: rgba(236, 72, 153, 0.2); color: #ec4899;">FX</span> Мікродеталі та Post-FX</span>
                        <span class="chevron ${isAccChev('fx')}" id="acc_tiling_fx_chev">▼</span>
                    </div>
                    <div class="accordion-content ${isAccOpen('fx')}" id="acc_tiling_fx">
                        ${tilingSlider("High-Pass Gain", "freq_gain", 0.5, 3.0, 0.05, "", 1.30)}
                        ${tilingSlider("Радіус High-Pass", "freq_radius", 1, 10, 1, "px", 3)}
                        ${tilingSlider("Unsharp Mask (Чіткість)", "sharpen", 0, 2.0, 0.05, "", 0.40)}
                        ${tilingSlider("Локальний контраст", "micro_contrast", 0.8, 1.6, 0.05, "", 1.10)}
                        ${tilingSlider("Інтенсивність зерна", "micro_noise", 0, 15, 0.5, "%", 2.5)}
                        <div class="control-group">
                            <label class="control-label">Тип зернистості:</label>
                            <select class="form-control" onchange="tilingState.micro_noise_scale=this.value; runTilingPipeline();">
                                <option value="fine" ${t.micro_noise_scale==='fine'?'selected':''}>Fine (Дрібний пісок)</option>
                                <option value="medium" ${t.micro_noise_scale==='medium'?'selected':''}>Medium (Середнє зерно)</option>
                                <option value="coarse" ${t.micro_noise_scale==='coarse'?'selected':''}>Coarse (Шорсткість)</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }

        // --- Історія (Undo/Redo) ---
        let history = []; // Array of { snap: string, paintData: { [layerId]: ImageData } }
        let historyIndex = -1;
        let historyTimer = null;
        let historyReady = false;
        let isRestoringHistory = false;
        const MAX_HISTORY = 20;
        const HISTORY_DEBOUNCE_MS = 450;

        function capturePaintCanvasesForHistory() {
            let data = {};
            if (state && state.layers) {
                state.layers.forEach(lay => {
                    if (lay.generatorType === 'paint') {
                        ensureLayerPaintCanvas(lay);
                        if (lay.paintCanvas) {
                            let pCtx = lay.paintCanvas.getContext('2d');
                            data[lay.id] = pCtx.getImageData(0, 0, 1024, 1024);
                            if (lay.params) {
                                lay.params.paintDataUrl = lay.paintCanvas.toDataURL();
                            }
                        }
                    }
                });
            }
            return data;
        }

        function restorePaintCanvasesFromHistory(entry) {
            if (!state || !state.layers || !entry) return;
            state.layers.forEach(lay => {
                if (lay.generatorType === 'paint') {
                    ensureLayerPaintCanvas(lay);
                    let pCtx = lay.paintCanvas.getContext('2d');
                    if (entry.paintData && entry.paintData[lay.id]) {
                        pCtx.putImageData(entry.paintData[lay.id], 0, 0);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                    } else if (lay.params && lay.params.paintDataUrl) {
                        let img = new Image();
                        img.onload = () => {
                            pCtx.clearRect(0, 0, 1024, 1024);
                            pCtx.drawImage(img, 0, 0);
                            updatePaintBuffer(lay);
                            lay.isDirty = true;
                            invalidateCaches();
                            requestRender();
                        };
                        img.src = lay.params.paintDataUrl;
                    } else {
                        pCtx.clearRect(0, 0, 1024, 1024);
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                    }
                }
            });
        }

        function captureTilingForHistory() {
            if (!tilingState) return null;
            let stampImgData = null;
            if (tilingStampCanvas && tilingStampCanvas.width > 0 && tilingStampCanvas.height > 0) {
                let sctx = tilingStampCanvas.getContext('2d');
                stampImgData = sctx.getImageData(0, 0, tilingStampCanvas.width, tilingStampCanvas.height);
            }
            let maskImgData = null;
            if (tilingMaskCanvas && tilingMaskCanvas.width > 0 && tilingMaskCanvas.height > 0) {
                let mctx = tilingMaskCanvas.getContext('2d');
                maskImgData = mctx.getImageData(0, 0, tilingMaskCanvas.width, tilingMaskCanvas.height);
            }
            let origImgData = null;
            if (tilingOriginalCanvas && tilingOriginalCanvas.width > 0 && tilingOriginalCanvas.height > 0) {
                let octx = tilingOriginalCanvas.getContext('2d');
                origImgData = octx.getImageData(0, 0, tilingOriginalCanvas.width, tilingOriginalCanvas.height);
            }
            return {
                tilingState: JSON.parse(JSON.stringify(tilingState)),
                origImgData: origImgData,
                stampImgData: stampImgData,
                maskImgData: maskImgData
            };
        }

        function restoreTilingFromHistory(entry) {
            if (!entry) return;
            if (entry.tilingData && entry.tilingData.tilingState) {
                let td = entry.tilingData;
                tilingState = JSON.parse(JSON.stringify(td.tilingState));
                if (td.origImgData) {
                    if (!tilingOriginalCanvas) tilingOriginalCanvas = document.createElement('canvas');
                    tilingOriginalCanvas.width = td.origImgData.width;
                    tilingOriginalCanvas.height = td.origImgData.height;
                    let octx = tilingOriginalCanvas.getContext('2d');
                    octx.putImageData(td.origImgData, 0, 0);
                }
                if (td.stampImgData) {
                    ensureTilingStampCanvas(td.stampImgData.width, td.stampImgData.height);
                    let sctx = tilingStampCanvas.getContext('2d');
                    sctx.putImageData(td.stampImgData, 0, 0);
                } else if (tilingStampCanvas) {
                    clearTilingStampCanvas();
                }
                if (td.maskImgData) {
                    ensureTilingMaskCanvas(td.maskImgData.width, td.maskImgData.height);
                    let mctx = tilingMaskCanvas.getContext('2d');
                    mctx.putImageData(td.maskImgData, 0, 0);
                } else if (tilingMaskCanvas) {
                    clearTilingMaskCanvas();
                }
            } else if (entry.snap) {
                try {
                    let snapObj = typeof entry.snap === 'string' ? JSON.parse(entry.snap) : entry.snap;
                    if (snapObj.tilingState) {
                        tilingState = JSON.parse(JSON.stringify(snapObj.tilingState));
                    }
                } catch(e) {}
            }
            if (tilingState && tilingState.hasImage) {
                runTilingPipeline();
            }
            if (typeof currentTab !== 'undefined' && currentTab === 'tiling') {
                renderTilingPanel();
                renderTilingView();
            }
        }

        function capturePbrForHistory() {
            if (window.mapGeneratorTab && typeof window.mapGeneratorTab.getPbrState === 'function') {
                return window.mapGeneratorTab.getPbrState();
            }
            return null;
        }

        function restorePbrFromHistory(entry) {
            let pbrState = null;
            if (entry && entry.pbrData) {
                pbrState = entry.pbrData;
            } else if (entry && entry.snap) {
                try {
                    let snapObj = typeof entry.snap === 'string' ? JSON.parse(entry.snap) : entry.snap;
                    if (snapObj.pbrState) pbrState = snapObj.pbrState;
                } catch(e) {}
            }
            if (pbrState && window.mapGeneratorTab && typeof window.mapGeneratorTab.loadPbrState === 'function') {
                window.mapGeneratorTab.loadPbrState(pbrState);
            }
        }

        function initHistory() {
            let snap = serializeState(state);
            let paintData = capturePaintCanvasesForHistory();
            let tilingData = captureTilingForHistory();
            let pbrData = capturePbrForHistory();
            history = [{ snap, paintData, tilingData, pbrData }];
            historyIndex = 0;
            historyReady = true;
            updateHistoryButtons();
        }

        function scheduleHistorySnapshot() {
            if (!historyReady || isPainting || strokeBackupActive || isRestoringHistory) return;
            if (typeof updateAutosaveUI === 'function') {
                updateAutosaveUI('Є зміни...', '#f59e0b', 'Проєкт змінено, очікується автозбереження');
            }
            clearTimeout(historyTimer);
            historyTimer = setTimeout(() => {
                if (!isPainting && !strokeBackupActive && !isRestoringHistory) {
                    if (isInteracting) {
                        scheduleHistorySnapshot();
                    } else {
                        commitHistorySnapshot();
                    }
                }
            }, HISTORY_DEBOUNCE_MS);
        }

        function commitHistorySnapshot() {
            if (!historyReady || isPainting || strokeBackupActive || isRestoringHistory) return;
            clearTimeout(historyTimer);
            let snap = serializeState(state);
            let tilingData = captureTilingForHistory();
            let pbrData = capturePbrForHistory();

            let prevEntry = history[historyIndex];
            if (prevEntry) {
                let snapSame = prevEntry.snap === snap;
                let tilingSame = JSON.stringify(prevEntry.tilingData) === JSON.stringify(tilingData);
                let pbrSame = JSON.stringify(prevEntry.pbrData) === JSON.stringify(pbrData);
                if (snapSame && tilingSame && pbrSame) return;
            }

            history = history.slice(0, historyIndex + 1);

            let paintData = capturePaintCanvasesForHistory();
            history.push({ snap, paintData, tilingData, pbrData });
            if (history.length > MAX_HISTORY) { history.shift(); }
            historyIndex = history.length - 1;
            updateHistoryButtons();

            if (typeof scheduleAutoSave === 'function') {
                scheduleAutoSave();
            }
        }

        function undo() {
            if (!historyReady) return;
            clearTimeout(historyTimer);
            if (isPainting || strokeBackupActive) {
                cancelPainting();
            }
            if (historyIndex <= 0) { updateHistoryButtons(); return; }

            isRestoringHistory = true;
            historyIndex--;
            let entry = history[historyIndex];
            setState(JSON.parse(entry.snap));
            restorePaintCanvasesFromHistory(entry);
            restoreTilingFromHistory(entry);
            restorePbrFromHistory(entry);
            afterHistoryRestore();
            isRestoringHistory = false;
        }

        function redo() {
            if (!historyReady) return;
            clearTimeout(historyTimer);
            if (isPainting || strokeBackupActive) {
                cancelPainting();
            }
            if (historyIndex >= history.length - 1) { updateHistoryButtons(); return; }

            isRestoringHistory = true;
            historyIndex++;
            let entry = history[historyIndex];
            setState(JSON.parse(entry.snap));
            restorePaintCanvasesFromHistory(entry);
            restoreTilingFromHistory(entry);
            restorePbrFromHistory(entry);
            afterHistoryRestore();
            isRestoringHistory = false;
        }

        function afterHistoryRestore() {
            if (!state.global) state.global = freshGlobalSettings();
            if (!state.global.warps) state.global.warps = [];
            if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
            }
            if (state.layers) {
                state.layers.forEach(l => {
                    l.isDirty = true;
                    if (!l.params) l.params = freshLayerParams();
                    if (!l.params.warps) l.params.warps = [];
                });
            }
            invalidateCaches();
            renderLayers();
            if (typeof currentTab !== 'undefined' && currentTab === 'global') {
                renderGlobal();
            } else if (typeof currentTab !== 'undefined' && currentTab === 'tiling') {
                renderTilingPanel();
                renderTilingView();
            } else if (typeof currentTab !== 'undefined' && currentTab === 'maps' && window.mapGeneratorTab) {
                window.mapGeneratorTab.renderRightPanelControls();
            } else {
                renderProps();
            }
            requestRender();
            updateHistoryButtons();
        }

        function updateHistoryButtons() {
            if ($('btnUndo')) $('btnUndo').disabled = (historyIndex <= 0);
            if ($('btnRedo')) $('btnRedo').disabled = (historyIndex >= history.length - 1 || historyIndex < 0);
            if ($('btnUndoPbr')) $('btnUndoPbr').disabled = (historyIndex <= 0);
            if ($('btnRedoPbr')) $('btnRedoPbr').disabled = (historyIndex >= history.length - 1 || historyIndex < 0);
        }

        document.addEventListener('keydown', e => {
            const mod = e.ctrlKey || e.metaKey;
            if (!mod) return;
            if (e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
            else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
        });

        let renderRequested = false;
        let isInteracting = false;
        let isPointerDownOnSlider = false;
        let interactionTimer = null;

        function invalidateCaches() {
            for (let i = 0; i < state.layers.length; i++) {
                state.layers[i].isDirty = true;
                state.layers[i].isDraftDirty = true;
                state.layers[i].isFullDirty = true;
            }
        }

        function requestRender() {
            if (renderRequested) return;
            renderRequested = true;
            requestAnimationFrame(() => {
                renderRequested = false;
                if (!suppressRender) {
                    let cv = canvas || $('canvas');
                    if (cv && (cv.width !== canvasResolution || cv.height !== canvasResolution)) {
                        setCanvasRes(canvasResolution, false);
                    }
                }
                renderProject();
            });
        }

        function triggerInteraction() {
            isInteracting = true;
            clearTimeout(interactionTimer);
            if (!isPointerDownOnSlider) {
                interactionTimer = setTimeout(() => {
                    isInteracting = false;
                    requestRender();
                }, 300);
            }
        }

        function upd(k, v, isGlobal = false) {
            let lay = state.layers.find(l => l.id === state.selectedLayerId);
            triggerInteraction();

            if (isGlobal) {
                let parsedVal;
                if (typeof v === 'boolean') {
                    parsedVal = v;
                } else if (v === 'true' || v === 'false') {
                    parsedVal = (v === 'true');
                } else if (typeof v === 'string' && isNaN(Number(v))) {
                    parsedVal = v;
                } else {
                    parsedVal = parseFloat(v);
                }
                state.global[k] = parsedVal;

                if (k === 'vignetteAmount') {
                    state.global.vignette = Math.abs(parsedVal / 100);
                } else if (k === 'vignette') {
                    state.global.vignetteAmount = -parsedVal * 100;
                }

                const COORD_PARAMS = ['globalZoom', 'globalScaleX', 'globalScaleY', 'globalRotation', 'globalOffsetX', 'globalOffsetY', 'globalPerspectiveV', 'globalPerspectiveH', 'tileRepeatX', 'tileRepeatY', 'tileSeamOffsetX', 'tileSeamOffsetY', 'forceSeamlessSoftness', 'blur', 'blurClampEdge', 'blurType'];
                if (COORD_PARAMS.includes(k) || k.startsWith('tile')) {
                    invalidateCaches();
                }
                if (['blurType', 'tileMode', 'blendCurve', 'forceSeamless'].includes(k)) {
                    renderGlobal();
                }
                if (!suppressRender) requestRender();
                return;
            }

            if (lay) {
                let val = v;
                if (v === 'true' || v === true) val = true;
                else if (v === 'false' || v === false) val = false;
                else if (typeof v === 'string' && isNaN(Number(v))) val = v;
                else if (!isNaN(v)) val = parseFloat(v);

                if (['visible', 'generatorType', 'name', 'opacity', 'blendMode'].includes(k)) {
                    lay[k] = val;
                    if (['visible', 'generatorType', 'name'].includes(k)) { 
                        lay.isDirty = true;
                        renderProps(); 
                        renderLayers(); 
                        renderStickyHeader(); 
                    }
                    if (['opacity', 'blendMode'].includes(k)) { 
                        let metaEl = document.querySelector(`.layer-card[data-layer-id="${lay.id}"] .layer-meta`);
                        if (metaEl) metaEl.innerHTML = `<span>${lay.generatorType.toUpperCase()}</span><span>${lay.blendMode.toUpperCase()} | ${lay.opacity}%</span>`;
                        renderStickyHeader(); 
                    }
                } else {
                    lay.params[k] = val;
                    lay.isDirty = true;
                    if (['seamless', 'useThreshold', 'useLevels', 'useFindEdges', 'usePosterize', 'brushTool', 'gradType', 'spreadMethod', 'sourceMode', 'metric', 'mode', 'lockScale', 'blurClampEdge', 'enableRays', 'enableRings', 'blurType', 'colorMode', 'palettePreset', 'sineMode', 'sineProfile'].includes(k)) {
                        renderProps();
                    }
                    if (String(k).startsWith('brush')) updateBrushPreview();
                }
                if (!suppressRender) requestRender();
            }
        }

        function showModal(id){ $(id).style.display='flex'; }
        let currentExportRes = 1024;
        function openPNGExportModal(){ 
            showModal('pngModal'); 
            const pbrContainer = $('mapGenViewportContainer');
            const isPbrActive = pbrContainer && pbrContainer.style.display !== 'none' && (typeof currentTab !== 'undefined' && currentTab === 'maps');
            const titleEl = document.querySelector('#pngModal .modal-title');
            if (titleEl) {
                if (isPbrActive && window.mapGeneratorTab) {
                    const mapName = (window.mapGeneratorTab.selectedMapType || 'normal').toUpperCase();
                    titleEl.textContent = `Експорт PNG — PBR Карта (${mapName})`;
                } else {
                    titleEl.textContent = (typeof t === 'function' && t('png_title')) ? t('png_title') : 'Експорт PNG';
                }
            }
            renderExportPreview(currentExportRes); 
        }

        let lastPreviewBlobUrl = null;

        function renderExportPreview(res) {
            currentExportRes = res;
            ['1024','2048','4096','8192'].forEach(r => { let b = $('exportRes'+r); if (b) b.classList.toggle('active', +r === res); });
            
            let downloadBtnText = $('exportDownloadBtnText');
            if (downloadBtnText) {
                downloadBtnText.textContent = `Завантажити PNG (${res} × ${res})`;
            }

            let ind = $('exportRenderingIndicator');
            if (ind) {
                ind.style.display = 'block';
                ind.textContent = 'Рендеринг прев\'ю...';
            }
            let img = $('modalPngPreview');
            if (img) img.style.opacity = '0.3';

            setTimeout(() => {
                let previewRes = Math.min(res, 1024);
                let tc = document.createElement('canvas'); 
                tc.width = previewRes; 
                tc.height = previewRes;

                const pbrContainer = $('mapGenViewportContainer');
                const isPbrActive = pbrContainer && pbrContainer.style.display !== 'none' && (typeof currentTab !== 'undefined' && currentTab === 'maps');

                if (isPbrActive && window.mapGeneratorTab) {
                    window.mapGeneratorTab.renderMapToCanvasAtRes(tc, previewRes);
                } else {
                    renderProject(tc, true);
                }

                tc.toBlob((blob) => {
                    if (!blob) return;
                    if (lastPreviewBlobUrl) URL.revokeObjectURL(lastPreviewBlobUrl);
                    lastPreviewBlobUrl = URL.createObjectURL(blob);
                    if (img) {
                        img.src = lastPreviewBlobUrl;
                        img.style.opacity = '1';
                    }
                    if (ind) ind.style.display = 'none';
                    if (previewRes >= 2048) freeHighResGlobalBuffers();
                }, 'image/png');
            }, 30);
        }

        async function triggerDirectPNGDownload() {
            const res = currentExportRes || 1024;
            const btn = $('btnDownloadPngModal');
            const ind = $('exportRenderingIndicator');
            if (ind) {
                ind.style.display = 'block';
                ind.textContent = `Генерація ${res}×${res} PNG... Будь ласка, зачекайте`;
            }
            if (btn) btn.disabled = true;

            await new Promise(r => setTimeout(r, 50));

            try {
                let tc = document.createElement('canvas');
                tc.width = res;
                tc.height = res;

                const pbrContainer = $('mapGenViewportContainer');
                const isPbrActive = pbrContainer && pbrContainer.style.display !== 'none' && (typeof currentTab !== 'undefined' && currentTab === 'maps');

                if (isPbrActive && window.mapGeneratorTab) {
                    window.mapGeneratorTab.renderMapToCanvasAtRes(tc, res);
                } else {
                    renderProject(tc, true);
                }

                tc.toBlob((blob) => {
                    if (!blob) {
                        alert("Не вдалося створити файл PNG.");
                        if (ind) ind.style.display = 'none';
                        if (btn) btn.disabled = false;
                        return;
                    }
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    let pbrSuffix = (isPbrActive && window.mapGeneratorTab) ? `_${window.mapGeneratorTab.selectedMapType || 'pbr'}` : '';
                    a.download = `veil_texture${pbrSuffix}_${res}x${res}.png`;
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 2000);

                    if (ind) ind.style.display = 'none';
                    if (btn) btn.disabled = false;
                    if (res >= 2048) freeHighResGlobalBuffers();
                }, 'image/png');
            } catch (err) {
                console.error("Export error:", err);
                alert("Помилка під час експорту: " + err.message);
                if (ind) ind.style.display = 'none';
                if (btn) btn.disabled = false;
            }
        }
        // --- .veil File Export & Import ---
        async function exportVeilFile() {
            showProgressLoader("Генерація файлу проєкту...", "Стиснення шарів...");
            await new Promise(res => setTimeout(res, 20));
            try {
                let serialized = serializeState(state);
                let blob = new Blob([serialized], { type: 'application/json' });
                let url = URL.createObjectURL(blob);

                let d = new Date();
                let dateStr = d.getFullYear() +
                    String(d.getMonth() + 1).padStart(2, '0') +
                    String(d.getDate()).padStart(2, '0') + '_' +
                    String(d.getHours()).padStart(2, '0') +
                    String(d.getMinutes()).padStart(2, '0');
                let fileName = `veil_project_${dateStr}.veil`;

                let a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 1000);

                hideProgressLoader();
            } catch (e) {
                hideProgressLoader();
                alert("Помилка при експорті файлу .veil: " + e.message);
            }
        }

        function triggerVeilImport() {
            let fileInput = $('importVeilFile');
            if (fileInput) {
                fileInput.click();
            }
        }

        function importProjectFile(e) {
            let file = e.target.files && e.target.files[0];
            if (!file) return;

            showProgressLoader("Читання файлу...", file.name);

            if (typeof file.text === 'function') {
                file.text().then(async text => {
                    try {
                        updateProgressLoaderSubtext("Парсинг тексту проєкту...");
                        await new Promise(res => setTimeout(res, 20));
                        let p = JSON.parse(text);
                        closeModal('projectManagerModal');
                        await loadProjectObjectAsync(p);
                    } catch (er) {
                        hideProgressLoader();
                        alert("Помилка зчитування файлу .veil / .json: " + er.message);
                    }
                    e.target.value = '';
                }).catch(err => {
                    hideProgressLoader();
                    alert("Помилка роботи з файлом: " + err.message);
                    e.target.value = '';
                });
            } else {
                let r = new FileReader();
                r.onload = async ev => {
                    try {
                        updateProgressLoaderSubtext("Парсинг тексту проєкту...");
                        await new Promise(res => setTimeout(res, 20));
                        let p = JSON.parse(ev.target.result);
                        closeModal('projectManagerModal');
                        await loadProjectObjectAsync(p);
                    } catch (er) {
                        hideProgressLoader();
                        alert("Помилка зчитування файлу .veil / .json: " + er.message);
                    }
                    e.target.value = '';
                };
                r.readAsText(file);
            }
        }

        // --- IndexedDB Local Fast Storage Service (VeilIDB) ---
        const IDB_NAME = 'VeilStudioDB';
        const IDB_VERSION = 1;
        const IDB_STORE = 'projects';

        function openVeilIDB() {
            return new Promise((resolve, reject) => {
                const req = indexedDB.open(IDB_NAME, IDB_VERSION);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(IDB_STORE)) {
                        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
                    }
                };
                req.onsuccess = (e) => resolve(e.target.result);
                req.onerror = (e) => reject(e.target.error);
            });
        }

        function canvasToBlobAsync(canvas) {
            return new Promise((resolve) => {
                if (!canvas) { resolve(null); return; }
                canvas.toBlob((blob) => resolve(blob), 'image/png');
            });
        }

        async function saveCurrentProjectToIDB() {
            let input = $('idbSlotNameInput');
            let customName = input ? input.value.trim() : '';

            showProgressLoader("Збереження у браузері...", "Обробка растрових даних...");
            await new Promise(res => setTimeout(res, 20));

            try {
                const db = await openVeilIDB();
                const paintBlobs = {};
                const paintCrops = {};

                if (state && state.layers) {
                    for (const lay of state.layers) {
                        if (lay.generatorType === 'paint') {
                            ensureLayerPaintCanvas(lay);
                            if (lay.paintCanvas) {
                                const comp = compressPaintCanvas(lay.paintCanvas);
                                if (comp.dataUrl) {
                                    const blob = await canvasToBlobAsync(lay.paintCanvas);
                                    if (blob) {
                                        paintBlobs[lay.id] = blob;
                                        paintCrops[lay.id] = comp.crop;
                                    }
                                }
                            }
                        }
                    }
                }

                const stateClean = JSON.parse(JSON.stringify(state, (key, value) => {
                    if (key === 'paintCanvas' || key === 'paintBuffer' || key === 'paintDataUrl') {
                        return undefined;
                    }
                    return value;
                }));

                const now = new Date();
                const defaultName = `Проєкт ${now.toLocaleDateString('uk-UA')} ${now.toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'})}`;
                const name = customName || defaultName;
                const id = 'slot_' + Date.now();

                const record = {
                    id,
                    name,
                    updatedAt: Date.now(),
                    dateStr: `${now.toLocaleDateString('uk-UA')} ${now.toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'})}`,
                    layerCount: state.layers ? state.layers.length : 0,
                    state: stateClean,
                    paintBlobs,
                    paintCrops
                };

                const tx = db.transaction(IDB_STORE, 'readwrite');
                const store = tx.objectStore(IDB_STORE);
                await new Promise((resolve, reject) => {
                    const req = store.put(record);
                    req.onsuccess = resolve;
                    req.onerror = reject;
                });

                if (input) input.value = '';
                hideProgressLoader();
                await renderIDBSlotsList();
            } catch (e) {
                hideProgressLoader();
                alert("Помилка збереження в IndexedDB: " + e.message);
            }
        }

        // --- Безшовне фонове Автозбереження (Zero-Performance Impact) ---
        let autoSaveTimer = null;
        let isAutoSaving = false;
        const AUTOSAVE_DEBOUNCE_MS = 2500;
        const IDB_AUTOSAVE_KEY = 'autosave_draft';

        function updateAutosaveUI(statusText, dotColor = '#10b981', title = '') {
            let elText = $('autosaveStatusText');
            let elDot = $('autosaveDot');
            if (elText && elText.textContent !== statusText) elText.textContent = statusText;
            if (elDot && elDot.style.background !== dotColor) elDot.style.background = dotColor;
            let meta = $('autosaveMeta');
            if (meta && title && meta.title !== title) meta.title = title;
        }

        function scheduleAutoSave() {
            updateAutosaveUI('Є зміни...', '#f59e0b', 'Проєкт змінено, очікується автозбереження');
            if (autoSaveTimer) clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                requestAutoSaveIdle();
            }, AUTOSAVE_DEBOUNCE_MS);
        }

        function requestAutoSaveIdle() {
            if (isPainting || strokeBackupActive || isRestoringHistory) {
                if (autoSaveTimer) clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => requestAutoSaveIdle(), 1500);
                return;
            }

            if (typeof window.requestIdleCallback === 'function') {
                window.requestIdleCallback(() => performAutoSave(), { timeout: 3000 });
            } else {
                setTimeout(() => performAutoSave(), 50);
            }
        }

        async function performAutoSave() {
            if (isAutoSaving || isPainting || strokeBackupActive || isRestoringHistory) return;
            isAutoSaving = true;
            updateAutosaveUI('Збереження...', '#3b82f6', 'Фонове автозбереження чернетки...');

            try {
                const db = await openVeilIDB();
                const paintBlobs = {};
                const paintCrops = {};

                if (state && state.layers) {
                    for (const lay of state.layers) {
                        if (lay.generatorType === 'paint') {
                            ensureLayerPaintCanvas(lay);
                            if (lay.paintCanvas) {
                                const comp = compressPaintCanvas(lay.paintCanvas);
                                if (comp.dataUrl) {
                                    const blob = await canvasToBlobAsync(lay.paintCanvas);
                                    if (blob) {
                                        paintBlobs[lay.id] = blob;
                                        paintCrops[lay.id] = comp.crop;
                                    }
                                }
                            }
                        }
                    }
                }

                prepareStateForSerialization();
                const stateClean = JSON.parse(JSON.stringify(state, (key, value) => {
                    if (key === 'paintCanvas' || key === 'paintBuffer' || key === 'paintDataUrl') {
                        return undefined;
                    }
                    return value;
                }));

                const now = new Date();
                const timeStr = now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                const record = {
                    id: IDB_AUTOSAVE_KEY,
                    name: '⚡ Автозбережена чернетка',
                    isAutoSave: true,
                    updatedAt: Date.now(),
                    dateStr: `${now.toLocaleDateString('uk-UA')} ${timeStr}`,
                    layerCount: state.layers ? state.layers.length : 0,
                    state: stateClean,
                    paintBlobs,
                    paintCrops,
                    tilingState: (typeof tilingState !== 'undefined' && tilingState) ? JSON.parse(JSON.stringify(tilingState)) : null
                };

                const tx = db.transaction(IDB_STORE, 'readwrite');
                const store = tx.objectStore(IDB_STORE);
                await new Promise((resolve, reject) => {
                    const req = store.put(record);
                    req.onsuccess = resolve;
                    req.onerror = reject;
                });

                localStorage.setItem('veil_has_autosave', 'true');
                localStorage.setItem('veil_autosave_time', timeStr.slice(0, 5));

                updateAutosaveUI(`Збережено о ${timeStr.slice(0, 5)}`, '#10b981', `Останнє автозбереження: ${record.dateStr}`);
            } catch (e) {
                console.warn('Помилка фонового автозбереження:', e);
                updateAutosaveUI('Помилка автозбереження', '#ef4444', e.message);
            } finally {
                isAutoSaving = false;
            }
        }

        async function restoreAutoSaveDraftOnBoot() {
            try {
                if (localStorage.getItem('veil_has_autosave') !== 'true') return false;
                const db = await openVeilIDB();
                const tx = db.transaction(IDB_STORE, 'readonly');
                const store = tx.objectStore(IDB_STORE);
                const record = await new Promise((resolve, reject) => {
                    const req = store.get(IDB_AUTOSAVE_KEY);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = reject;
                });

                if (!record || !record.state || !record.state.layers || record.state.layers.length === 0) {
                    return false;
                }

                setState(record.state);
                state.global = Object.assign(freshGlobalSettings(), state.global || {});
                if (!state.global.warps) state.global.warps = [];

                if (state.layers) {
                    state.layers.forEach(l => {
                        l.isDirty = true;
                        l.params = Object.assign(freshLayerParams(), l.params || {});
                        if (!l.params.warps) l.params.warps = [];
                    });
                }

                if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                    state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
                }

                if (record.paintBlobs) {
                    const paintPromises = state.layers.filter(l => l.generatorType === 'paint').map(async (lay) => {
                        ensureLayerPaintCanvas(lay, false);
                        const pCtx = lay.paintCanvas.getContext('2d');
                        pCtx.fillStyle = '#000000';
                        pCtx.fillRect(0, 0, 1024, 1024);

                        const blob = record.paintBlobs[lay.id];
                        if (blob) {
                            let bitmap = null;
                            if (typeof createImageBitmap === 'function') {
                                try { bitmap = await createImageBitmap(blob); } catch(e){}
                            }
                            if (bitmap) {
                                const crop = record.paintCrops ? record.paintCrops[lay.id] : null;
                                if (crop && typeof crop.x === 'number') {
                                    pCtx.drawImage(bitmap, crop.x, crop.y, crop.w, crop.h);
                                } else {
                                    pCtx.drawImage(bitmap, 0, 0, 1024, 1024);
                                }
                                if (typeof bitmap.close === 'function') bitmap.close();
                            } else {
                                const url = URL.createObjectURL(blob);
                                await new Promise((res) => {
                                    const img = new Image();
                                    img.onload = () => {
                                        pCtx.drawImage(img, 0, 0, 1024, 1024);
                                        URL.revokeObjectURL(url);
                                        res();
                                    };
                                    img.onerror = () => { URL.revokeObjectURL(url); res(); };
                                    img.src = url;
                                });
                            }
                        }
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                    });
                    await Promise.all(paintPromises);
                }

                invalidateCaches();
                renderLayers();

                if (record.tilingState || (record.state && record.state.tilingState)) {
                    tilingState = JSON.parse(JSON.stringify(record.tilingState || record.state.tilingState));
                }
                if (record.state && record.state.tilingCustomImageDataUrl) {
                    let img = new Image();
                    img.onload = () => {
                        if (!tilingOriginalCanvas) tilingOriginalCanvas = document.createElement('canvas');
                        tilingOriginalCanvas.width = img.width;
                        tilingOriginalCanvas.height = img.height;
                        let octx = tilingOriginalCanvas.getContext('2d');
                        octx.drawImage(img, 0, 0);
                        tilingState.hasImage = true;
                        tilingState.customImageLoaded = true;
                        runTilingPipeline();
                        if (currentTab === 'tiling') { renderTilingPanel(); renderTilingView(); }
                    };
                    img.src = record.state.tilingCustomImageDataUrl;
                } else if (tilingState && tilingState.hasImage) {
                    runTilingPipeline();
                }

                if (record.state && record.state.pbrState && window.mapGeneratorTab && typeof window.mapGeneratorTab.loadPbrState === 'function') {
                    window.mapGeneratorTab.loadPbrState(record.state.pbrState);
                }

                if (typeof currentTab !== 'undefined' && currentTab === 'global') {
                    renderGlobal();
                } else if (typeof currentTab !== 'undefined' && currentTab === 'tiling') {
                    renderTilingPanel();
                    renderTilingView();
                } else if (typeof currentTab !== 'undefined' && currentTab === 'maps' && window.mapGeneratorTab) {
                    window.mapGeneratorTab.renderRightPanelControls();
                } else {
                    renderProps();
                }
                requestRender();
                initHistory();

                const timeStr = localStorage.getItem('veil_autosave_time') || record.dateStr;
                updateAutosaveUI(`Відновлено (${timeStr})`, '#10b981', `Відновлено автозбережену чернетку: ${record.dateStr}`);
                return true;
            } catch (e) {
                console.warn('Не вдалося відновити автозбережену чернетку:', e);
                return false;
            }
        }

        async function getIDBSlotsList() {
            try {
                const db = await openVeilIDB();
                const tx = db.transaction(IDB_STORE, 'readonly');
                const store = tx.objectStore(IDB_STORE);
                return new Promise((resolve, reject) => {
                    const req = store.getAll();
                    req.onsuccess = () => {
                        const list = req.result || [];
                        list.sort((a, b) => b.updatedAt - a.updatedAt);
                        resolve(list);
                    };
                    req.onerror = reject;
                });
            } catch (e) {
                return [];
            }
        }

        async function renderIDBSlotsList() {
            let container = $('idbSlotsContainer');
            let badge = $('idbSlotCountBadge');
            if (!container) return;

            let slots = await getIDBSlotsList();
            if (badge) badge.textContent = slots.length ? `(всього: ${slots.length})` : '';

            if (slots.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-muted); font-size:12px;">Немає збережених слотів у цьому браузері.</div>`;
                return;
            }

            container.innerHTML = slots.map(slot => {
                let layersText = `${slot.layerCount || 0} ${slot.layerCount === 1 ? 'шар' : (slot.layerCount >= 2 && slot.layerCount <= 4) ? 'шари' : 'шарів'}`;
                let isAuto = slot.isAutoSave || slot.id === IDB_AUTOSAVE_KEY;
                let badgeHtml = isAuto ? `<span style="background:rgba(245, 158, 11, 0.2); color:#f59e0b; border:1px solid rgba(245, 158, 11, 0.4); padding:1px 6px; border-radius:4px; font-size:10px; margin-left:6px; font-weight:600;">Чернетка</span>` : '';
                return `
                <div class="idb-slot-card" style="${isAuto ? 'border: 1px solid rgba(245, 158, 11, 0.35); background: rgba(245, 158, 11, 0.04);' : ''}">
                    <div class="idb-slot-info">
                        <div class="idb-slot-title" style="display:flex; align-items:center;">${slot.name} ${badgeHtml}</div>
                        <div class="idb-slot-meta">${slot.dateStr} | ${layersText}</div>
                    </div>
                    <div style="display:flex; gap:4px; flex-shrink:0;">
                        <button class="btn btn-primary" style="padding:4px 8px; font-size:11px;" onclick="loadProjectFromIDB('${slot.id}')">Завантажити</button>
                        <button class="btn btn-secondary" style="padding:4px 8px; font-size:11px; color:#ef4444;" onclick="deleteIDBSlot('${slot.id}')">🗑️</button>
                    </div>
                </div>`;
            }).join('');
        }

        async function loadProjectFromIDB(id) {
            showProgressLoader("Завантаження з IDB...", "Читання слоту...");
            await new Promise(res => setTimeout(res, 20));

            try {
                const db = await openVeilIDB();
                const tx = db.transaction(IDB_STORE, 'readonly');
                const store = tx.objectStore(IDB_STORE);
                const record = await new Promise((resolve, reject) => {
                    const req = store.get(id);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = reject;
                });

                if (!record) throw new Error("Слот не знайдено");

                setState(record.state);
                state.global = Object.assign(freshGlobalSettings(), state.global || {});
                if (!state.global.warps) state.global.warps = [];

                if (state.layers) {
                    state.layers.forEach(l => {
                        l.isDirty = true;
                        l.params = Object.assign(freshLayerParams(), l.params || {});
                        if (!l.params.warps) l.params.warps = [];
                    });
                }

                if (!state.layers.find(l => l.id === state.selectedLayerId)) {
                    state.selectedLayerId = state.layers.length ? state.layers[0].id : null;
                }

                if (record.paintBlobs) {
                    updateProgressLoaderSubtext("Декодування растрових шарів...");
                    const paintPromises = state.layers.filter(l => l.generatorType === 'paint').map(async (lay) => {
                        ensureLayerPaintCanvas(lay, false);
                        const pCtx = lay.paintCanvas.getContext('2d');
                        pCtx.fillStyle = '#000000';
                        pCtx.fillRect(0, 0, 1024, 1024);

                        const blob = record.paintBlobs[lay.id];
                        if (blob) {
                            let bitmap = null;
                            if (typeof createImageBitmap === 'function') {
                                try { bitmap = await createImageBitmap(blob); } catch(e){}
                            }
                            if (bitmap) {
                                const crop = record.paintCrops ? record.paintCrops[lay.id] : null;
                                if (crop && typeof crop.x === 'number') {
                                    pCtx.drawImage(bitmap, crop.x, crop.y, crop.w, crop.h);
                                } else {
                                    pCtx.drawImage(bitmap, 0, 0, 1024, 1024);
                                }
                                if (typeof bitmap.close === 'function') bitmap.close();
                            } else {
                                const url = URL.createObjectURL(blob);
                                await new Promise((res) => {
                                    const img = new Image();
                                    img.onload = () => {
                                        pCtx.drawImage(img, 0, 0, 1024, 1024);
                                        URL.revokeObjectURL(url);
                                        res();
                                    };
                                    img.onerror = () => { URL.revokeObjectURL(url); res(); };
                                    img.src = url;
                                });
                            }
                        }
                        updatePaintBuffer(lay);
                        lay.isDirty = true;
                    });

                    await Promise.all(paintPromises);
                }

                invalidateCaches();
                renderLayers();
                if (typeof currentTab !== 'undefined' && currentTab === 'global') renderGlobal(); else renderProps();
                requestRender();
                initHistory();

                hideProgressLoader();
                closeModal('projectManagerModal');
            } catch (e) {
                hideProgressLoader();
                alert("Помилка завантаження слоту IDB: " + e.message);
            }
        }

        async function deleteIDBSlot(id) {
            if (!confirm("Видалити цей слот з локального сховища браузера?")) return;
            try {
                const db = await openVeilIDB();
                const tx = db.transaction(IDB_STORE, 'readwrite');
                const store = tx.objectStore(IDB_STORE);
                await new Promise((resolve, reject) => {
                    const req = store.delete(id);
                    req.onsuccess = resolve;
                    req.onerror = reject;
                });
                await renderIDBSlotsList();
            } catch (e) {
                alert("Помилка видалення: " + e.message);
            }
        }

        // --- Modal & Navigation Helpers ---
        function closeModal(id) {
            let el = $(id);
            if (el) el.style.display = 'none';
        }

        function openProjectManagerModal(tab = 'file') {
            switchProjectTab(tab);
            showModal('projectManagerModal');
        }

        function switchProjectTab(tab) {
            ['file', 'idb', 'text'].forEach(t => {
                let btn = $('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
                let content = $('projectTab' + t.charAt(0).toUpperCase() + t.slice(1));
                if (btn) btn.classList.toggle('active', t === tab);
                if (content) content.style.display = (t === tab) ? 'block' : 'none';
            });
            if (tab === 'idb') {
                renderIDBSlotsList();
            } else if (tab === 'text') {
                try {
                    let txtEl = $('projectJsonText');
                    if (txtEl) txtEl.value = serializeState(state);
                } catch(e){}
            }
        }

        async function openSaveModal() {
            openProjectManagerModal('file');
        }

        function copyProjectCode() {
            let t = $('projectJsonText');
            if (!t) return;
            t.select();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(t.value).then(() => {
                    let b = $('copyJsonBtn');
                    if (b) {
                        b.innerText = "Скопійовано у буфер!";
                        setTimeout(() => { if ($('copyJsonBtn')) $('copyJsonBtn').innerText = "Скопіювати у буфер"; }, 2000);
                    }
                }).catch(() => {
                    document.execCommand('copy');
                    let b = $('copyJsonBtn');
                    if (b) b.innerText = "Скопійовано!";
                });
            } else {
                document.execCommand('copy');
                let b = $('copyJsonBtn');
                if (b) b.innerText = "Скопійовано!";
            }
        }

        async function loadProjectFromText() {
            let textarea = $('importJsonText');
            let text = textarea ? textarea.value.trim() : '';
            if (!text) {
                alert("Будь ласка, вставте JSON код проєкту в текстове поле");
                return;
            }

            showProgressLoader("Імпорт проєкту...", "Парсинг JSON даних...");
            await new Promise(res => setTimeout(res, 30));

            try {
                let p = JSON.parse(text);
                closeModal('projectManagerModal');
                if (textarea) textarea.value = '';
                await loadProjectObjectAsync(p);
            } catch (e) {
                hideProgressLoader();
                alert("Помилка JSON проєкту: " + e.message);
            }
        }

        async function pasteFromClipboardAndLoad() {
            try {
                if (!navigator.clipboard || !navigator.clipboard.readText) {
                    alert("Ваш браузер не підтримує читання з буфера обміну. Будь ласка, вставте код в текстове поле вручну.");
                    return;
                }

                showProgressLoader("Зчитування з буфера...", "Отримання коду...");
                let text = await navigator.clipboard.readText();
                text = text ? text.trim() : '';
                if (!text) {
                    hideProgressLoader();
                    alert("Буфер обміну порожній!");
                    return;
                }

                updateProgressLoaderSubtext("Парсинг JSON даних...");
                await new Promise(res => setTimeout(res, 20));

                let p = JSON.parse(text);
                closeModal('projectManagerModal');
                await loadProjectObjectAsync(p);
            } catch (e) {
                hideProgressLoader();
                alert("Не вдалося прочитати з буфера обміну або помилка JSON: " + e.message);
            }
        }

        function importProject(e) {
            importProjectFile(e);
        }

        // --- Розтяжні панелі (Шари / Властивості) ---
        // Тягнути за смужку між панеллю та канвасом — ширина зберігається між
        // сесіями (localStorage), окремо від самого проєкту (це UI-налаштування,
        // не частина .json проєкту).
        function setupResizeHandle(handleId, panel, side) {
            const handle = $(handleId);
            if (!handle || !panel) return;
            const MIN_W = 220, MAX_W = 560;
            let dragging = false, startX = 0, startWidth = 0;

            function begin(clientX) {
                dragging = true; startX = clientX; startWidth = panel.getBoundingClientRect().width;
                handle.classList.add('dragging');
                document.body.style.userSelect = 'none';
            }
            function move(clientX) {
                if (!dragging) return;
                let delta = clientX - startX;
                if (side === 'right') delta = -delta;
                let newWidth = Math.max(MIN_W, Math.min(MAX_W, startWidth + delta));
                panel.style.width = newWidth + 'px';
            }
            function end() {
                if (!dragging) return;
                dragging = false;
                handle.classList.remove('dragging');
                document.body.style.userSelect = '';
                try { localStorage.setItem('veil_panel_' + handleId, panel.style.width); } catch(e) {}
            }

            handle.addEventListener('mousedown', e => { e.preventDefault(); begin(e.clientX); });
            window.addEventListener('mousemove', e => move(e.clientX));
            window.addEventListener('mouseup', end);
            handle.addEventListener('touchstart', e => { begin(e.touches[0].clientX); }, {passive:true});
            handle.addEventListener('touchmove', e => { move(e.touches[0].clientX); e.preventDefault(); }, {passive:false});
            handle.addEventListener('touchend', end);
            handle.addEventListener('dblclick', () => {
                panel.style.width = '';
                try { localStorage.removeItem('veil_panel_' + handleId); } catch(e) {}
            });

            try {
                let saved = localStorage.getItem('veil_panel_' + handleId);
                if (saved) panel.style.width = saved;
            } catch(e) {}
        }

        window.setCanvasResolution = function(res) {
            canvasResolution = res;
            try { localStorage.setItem('veil_canvas_resolution', res); } catch(e) {}
            ['512', '1024'].forEach(r => {
                let btn = $('resBtn' + r);
                if (btn) btn.classList.toggle('active', parseInt(r) === res);
            });
            requestRender();
        };

        window.setLowResOnEdit = function(val) {
            lowResOnEdit = val;
            try { localStorage.setItem('veil_low_res_on_edit', val); } catch(e) {}
            if ($('chkLowRes')) $('chkLowRes').checked = val;
            requestRender();
        };

        window.applyCanvasBorderStyles = function() {
            let cv = $('canvas');
            if (!cv) return;
            cv.classList.toggle('no-border', !showCanvasBorder);
            cv.style.setProperty('--b-intensity', canvasBorderIntensity);
        };

        window.toggleCanvasBorder = function(val) {
            showCanvasBorder = val;
            try { localStorage.setItem('veil_show_canvas_border', val); } catch(e) {}
            if ($('chkCanvasBorder')) $('chkCanvasBorder').checked = val;
            applyCanvasBorderStyles();
        };

        window.setCanvasBorderIntensity = function(val) {
            let intVal = parseFloat(val) / 100;
            if (isNaN(intVal)) intVal = 1.0;
            canvasBorderIntensity = Math.max(0, Math.min(1, intVal));
            try { localStorage.setItem('veil_canvas_border_intensity', canvasBorderIntensity); } catch(e) {}
            
            if ($('borderIntensityValText')) {
                $('borderIntensityValText').innerText = Math.round(canvasBorderIntensity * 100) + '%';
            }
            if ($('rngBorderIntensity')) {
                $('rngBorderIntensity').value = Math.round(canvasBorderIntensity * 100);
            }
            
            if (canvasBorderIntensity > 0 && !showCanvasBorder) {
                toggleCanvasBorder(true);
            } else if (canvasBorderIntensity === 0 && showCanvasBorder) {
                toggleCanvasBorder(false);
            } else {
                applyCanvasBorderStyles();
            }
        };

        window.toggleBorderSliderPopover = function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            let pop = $('borderSliderPopover');
            if (!pop) return;
            pop.classList.toggle('hidden');
        };

        document.addEventListener('click', function(evt) {
            let pop = $('borderSliderPopover');
            let wrapper = $('borderControlWrapper');
            if (pop && !pop.classList.contains('hidden') && wrapper && !wrapper.contains(evt.target)) {
                pop.classList.add('hidden');
            }
        });

        // Expose all state and action handlers to window globally
        window.exportVeilFile = exportVeilFile;
        window.triggerVeilImport = triggerVeilImport;
        window.importProjectFile = importProjectFile;
        window.saveCurrentProjectToIDB = saveCurrentProjectToIDB;
        window.loadProjectFromIDB = loadProjectFromIDB;
        window.deleteIDBSlot = deleteIDBSlot;
        window.openProjectManagerModal = openProjectManagerModal;
        window.switchProjectTab = switchProjectTab;
        window.closeModal = closeModal;
        window.commitHistorySnapshot = commitHistorySnapshot;
        window.scheduleHistorySnapshot = scheduleHistorySnapshot;
        window.state = state;
        window.viewport = viewport;
        window.undo = undo;
        window.redo = redo;
        window.resetProject = resetProject;
        window.resetGlobalSettings = resetGlobalSettings;
        window.addGlobalWarp = addGlobalWarp;
        window.removeGlobalWarp = removeGlobalWarp;
        window.toggleGlobalWarp = toggleGlobalWarp;
        window.moveGlobalWarp = moveGlobalWarp;
        window.updateGlobalWarp = updateGlobalWarp;
        window.addLayer = addLayer;
        window.switchRightTab = switchRightTab;
        window.openSaveModal = openSaveModal;
        window.openPNGExportModal = openPNGExportModal;
        window.renderExportPreview = renderExportPreview;
        window.triggerDirectPNGDownload = triggerDirectPNGDownload;
        window.loadProjectFromText = loadProjectFromText;
        window.pasteFromClipboardAndLoad = pasteFromClipboardAndLoad;
        window.showProgressLoader = showProgressLoader;
        window.hideProgressLoader = hideProgressLoader;
        window.copyProjectCode = copyProjectCode;
        window.importProject = importProject;
        window.toggleLayerVisibility = toggleLayerVisibility;
        window.toggleMask = toggleMask;
        window.duplicateLayer = duplicateLayer;
        window.deleteLayer = deleteLayer;
        window.moveLayer = moveLayer;
        window.randomizeAlgorithm = randomizeAlgorithm;
        window.renderStickyHeader = renderStickyHeader;
        window.resetLayer = resetLayer;
        window.upd = upd;
        window.showModal = showModal;
        window.renderLayers = renderLayers;
        window.renderProps = renderProps;
        window.requestRender = requestRender;
        window.triggerInteraction = triggerInteraction;
        window.toggleTilingStamp = toggleTilingStamp;
        window.toggleTilingMaskBrush = toggleTilingMaskBrush;
        window.toggleSelectingStampSource = toggleSelectingStampSource;
        window.toggleCanvasBorder = toggleCanvasBorder;
        window.setCanvasBorderIntensity = setCanvasBorderIntensity;
        window.toggleBorderSliderPopover = toggleBorderSliderPopover;
        window.scheduleAutoSave = scheduleAutoSave;
        window.performAutoSave = performAutoSave;
        window.restoreAutoSaveDraftOnBoot = restoreAutoSaveDraftOnBoot;
        window.updateAutosaveUI = updateAutosaveUI;

        function initCanvasControlsUI() {
            if ($('chkLowRes')) $('chkLowRes').checked = lowResOnEdit;
            if ($('chkCanvasBorder')) $('chkCanvasBorder').checked = showCanvasBorder;
            if ($('rngBorderIntensity')) $('rngBorderIntensity').value = Math.round(canvasBorderIntensity * 100);
            if ($('borderIntensityValText')) $('borderIntensityValText').innerText = Math.round(canvasBorderIntensity * 100) + '%';
            applyCanvasBorderStyles();
            ['512', '1024'].forEach(r => {
                let btn = $('resBtn' + r);
                if (btn) btn.classList.toggle('active', parseInt(r) === canvasResolution);
            });
        }

        function initDragAndDrop() {
            let ghost = null;
            let activeItem = null;
            let container = null;
            let isLayer = false;
            let isWarp = false;
            let offsetX = 0;
            let offsetY = 0;

            document.addEventListener('pointerdown', (e) => {
                if (e.button !== undefined && e.button !== 0) return;
                if (e.target.closest('button, input, select, textarea, label, .reset-btn')) return;

                const card = e.target.closest('.layer-card, .warp-card');
                if (!card) return;

                isLayer = card.classList.contains('layer-card');
                isWarp = card.classList.contains('warp-card');

                container = card.parentElement;
                if (!container) return;

                activeItem = card;
                const rect = activeItem.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                ghost = activeItem.cloneNode(true);
                ghost.id = 'drag-ghost-clone';
                ghost.style.position = 'fixed';
                ghost.style.left = (e.clientX - offsetX) + 'px';
                ghost.style.top = (e.clientY - offsetY) + 'px';
                ghost.style.width = rect.width + 'px';
                ghost.style.height = rect.height + 'px';
                ghost.style.pointerEvents = 'none';
                ghost.style.zIndex = '999999';
                ghost.style.opacity = '0.85';
                ghost.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
                ghost.style.transform = 'scale(1.02)';
                ghost.style.transition = 'transform 0.05s ease';

                document.body.appendChild(ghost);
                activeItem.style.opacity = '0.35';

                const onPointerMove = (moveEvt) => {
                    if (!ghost || !activeItem) return;

                    ghost.style.left = (moveEvt.clientX - offsetX) + 'px';
                    ghost.style.top = (moveEvt.clientY - offsetY) + 'px';

                    ghost.style.display = 'none';
                    const elemBelow = document.elementFromPoint(moveEvt.clientX, moveEvt.clientY);
                    ghost.style.display = 'block';

                    if (!elemBelow) return;

                    const targetSelector = isLayer ? '.layer-card' : '.warp-card';
                    const targetItem = elemBelow.closest(targetSelector);

                    if (targetItem && targetItem !== activeItem && targetItem.parentElement === container) {
                        const targetRect = targetItem.getBoundingClientRect();
                        const targetCenterY = targetRect.top + targetRect.height / 2;

                        if (moveEvt.clientY > targetCenterY) {
                            container.insertBefore(activeItem, targetItem.nextElementSibling);
                        } else {
                            container.insertBefore(activeItem, targetItem);
                        }
                    }
                };

                const onPointerUp = () => {
                    document.removeEventListener('pointermove', onPointerMove);
                    document.removeEventListener('pointerup', onPointerUp);
                    document.removeEventListener('pointercancel', onPointerUp);

                    if (ghost && ghost.parentElement) {
                        ghost.parentElement.removeChild(ghost);
                    }
                    if (activeItem) {
                        activeItem.style.opacity = '';
                    }

                    if (isLayer && container) {
                        const layerCards = Array.from(container.querySelectorAll('.layer-card'));
                        const newLayersOrder = [];
                        layerCards.forEach(c => {
                            const layerId = c.getAttribute('data-layer-id');
                            const lay = state.layers.find(l => l.id === layerId);
                            if (lay) newLayersOrder.push(lay);
                        });
                        if (newLayersOrder.length === state.layers.length) {
                            let orderChanged = false;
                            for (let i = 0; i < state.layers.length; i++) {
                                if (state.layers[i] !== newLayersOrder[i]) {
                                    orderChanged = true;
                                    break;
                                }
                            }
                            if (orderChanged) {
                                state.layers = newLayersOrder;
                                commitHistorySnapshot();
                                renderLayers();
                                requestRender();
                            }
                        }
                    } else if (isWarp && container) {
                        const lay = state.layers.find(l => l.id === state.selectedLayerId);
                        if (lay && lay.params && lay.params.warps) {
                            const warpCards = Array.from(container.querySelectorAll('.warp-card'));
                            const newWarpsOrder = [];
                            warpCards.forEach(c => {
                                const warpIdx = parseInt(c.getAttribute('data-warp-index'));
                                if (!isNaN(warpIdx) && lay.params.warps[warpIdx]) {
                                    newWarpsOrder.push(lay.params.warps[warpIdx]);
                                }
                            });
                            if (newWarpsOrder.length === lay.params.warps.length) {
                                let orderChanged = false;
                                for (let i = 0; i < lay.params.warps.length; i++) {
                                    if (lay.params.warps[i] !== newWarpsOrder[i]) {
                                        orderChanged = true;
                                        break;
                                    }
                                }
                                if (orderChanged) {
                                    lay.params.warps = newWarpsOrder;
                                    lay.isDirty = true;
                                    commitHistorySnapshot();
                                    renderProps();
                                    requestRender();
                                }
                            }
                        }
                    }

                    ghost = null;
                    activeItem = null;
                    container = null;
                };

                document.addEventListener('pointermove', onPointerMove);
                document.addEventListener('pointerup', onPointerUp);
                document.addEventListener('pointercancel', onPointerUp);
            });
        }

        document.addEventListener('DOMContentLoaded', async () => { 
            canvas=$('canvas'); 
            ctx=canvas.getContext('2d'); 
            initCanvasControlsUI();
            initDragAndDrop();

            // Global slider interaction optimization listeners
            document.addEventListener('pointerdown', (e) => {
                if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'range') {
                    isPointerDownOnSlider = true;
                    isInteracting = true;
                    clearTimeout(interactionTimer);
                }
            }, { passive: true });

            const endSliderInteraction = () => {
                if (isPointerDownOnSlider || isInteracting) {
                    isPointerDownOnSlider = false;
                    clearTimeout(interactionTimer);
                    interactionTimer = setTimeout(() => {
                        isInteracting = false;
                        requestRender();
                    }, 50);
                }
            };
            window.addEventListener('pointerup', endSliderInteraction, { passive: true });
            window.addEventListener('pointercancel', endSliderInteraction, { passive: true });
            document.addEventListener('change', (e) => {
                if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'range') {
                    endSliderInteraction();
                }
            }, { passive: true });

            // Register pointer events for painting
            let wrapper = $('canvasWrapper');
            if (wrapper) {
                paintModule.init(wrapper, canvas);
                wrapper.addEventListener('pointerdown', handleCanvasPointerDown);
                wrapper.addEventListener('pointermove', handleCanvasPointerMove);
                window.addEventListener('pointerup', handleCanvasPointerUp);
                window.addEventListener('pointercancel', handleCanvasPointerUp);

                // Prevent text selection and drag highlights when painting with mouse
                wrapper.addEventListener('mousedown', e => {
                    let lay = state.layers.find(l => l.id === state.selectedLayerId);
                    if (lay && lay.generatorType === 'paint' && lay.visible && e.button === 0) {
                        e.preventDefault();
                    }
                });
                wrapper.addEventListener('mousemove', e => {
                    if (isPainting) e.preventDefault();
                });
                wrapper.addEventListener('selectstart', e => e.preventDefault());
                wrapper.addEventListener('dragstart', e => e.preventDefault());
            }

            if (canvas) {
                canvas.addEventListener('selectstart', e => e.preventDefault());
                canvas.addEventListener('dragstart', e => e.preventDefault());
            }

            // Restore saved language or default to 'uk'
            let initialLang = localStorage.getItem('veil_language') || 'uk';
            setLanguage(initialLang);

            // Автоматичне відновлення автозбереженої чернетки під час старту
            let restoredDraft = await restoreAutoSaveDraftOnBoot();
            if (!restoredDraft) {
                renderLayers(); 
                switchRightTab('layer'); 
                requestRender(); 
                initHistory(); 
            } else {
                switchRightTab('layer');
            }

            setupResizeHandle('resizeLeft', document.querySelector('aside:not(.right-panel)'), 'left'); 
            setupResizeHandle('resizeRight', document.querySelector('.right-panel'), 'right'); 

            // Безпечне збереження перед закриттям або перемиканням вкладки
            window.addEventListener('beforeunload', () => {
                if (typeof performAutoSave === 'function') {
                    performAutoSave();
                }
            });
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden' && typeof performAutoSave === 'function') {
                    performAutoSave();
                }
            });
        });

        let benchmarkInterval = null;
        window.openBenchmarkModal = function() {
            let modal = $('benchmarkModal');
            if (!modal) return;
            modal.style.display = 'flex';
            updateBenchmarkLiveMetrics();
            if (!benchmarkInterval) {
                benchmarkInterval = setInterval(updateBenchmarkLiveMetrics, 500);
            }
        };

        window.closeBenchmarkModal = function() {
            let modal = $('benchmarkModal');
            if (modal) modal.style.display = 'none';
            if (benchmarkInterval) {
                clearInterval(benchmarkInterval);
                benchmarkInterval = null;
            }
        };

        function updateBenchmarkLiveMetrics() {
            if (!window.globalProfiler) return;
            let snap = window.globalProfiler.getSnapshot();
            if ($('benchLiveFps')) $('benchLiveFps').textContent = `${snap.fps} FPS`;
            if ($('benchLiveMs')) $('benchLiveMs').textContent = `${snap.lastFrameMs.toFixed(1)} ms / кадр`;
            if ($('benchLiveMem')) $('benchLiveMem').textContent = `${snap.memoryMB} MB`;
            if ($('benchLivePool')) $('benchLivePool').textContent = `${snap.pooledBuffersCount} буферів у пулі (${snap.pooledBufferBytesMB} MB)`;
        }

        window.startAutomatedBenchmark = async function() {
            if (!window.StressTestRunner || !window.globalProfiler) {
                console.warn("Profiler or StressTestRunner not initialized yet. Waiting...");
                alert("Зачекайте секунду, профілювальник ініціалізується...");
                return;
            }
            let runBtn = $('runBenchBtn');
            let progressBox = $('benchProgressBox');
            let progressBar = $('benchProgressBar');
            let progressText = $('benchProgressText');
            let reportBox = $('benchReportBox');

            if (runBtn) runBtn.disabled = true;
            if (progressBox) progressBox.style.display = 'block';
            if (reportBox) reportBox.style.display = 'none';

            let runner = new window.StressTestRunner(
                window.globalProfiler,
                () => renderProject(),
                state,
                (res) => setCanvasRes(res)
            );

            let report = await runner.runFullBenchmarkSuite((prog) => {
                if (progressBar) progressBar.style.width = `${prog.percent}%`;
                if (progressText) progressText.textContent = `[Крок ${prog.step}/4] ${prog.msg}`;
            });

            if (progressBox) progressBox.style.display = 'none';
            if (runBtn) runBtn.disabled = false;

            if (report && reportBox) {
                reportBox.style.display = 'block';
                if ($('benchGradeBadge')) $('benchGradeBadge').textContent = `ОЦІНКА: ${report.grade}`;

                if ($('benchResReport')) {
                    let text = '';
                    for (let r in report.resolutions) {
                        text += `• <b>${r}×${r}</b>: ${report.resolutions[r].avgMs} ms (${report.resolutions[r].fps} FPS)<br>`;
                    }
                    $('benchResReport').innerHTML = text;
                }

                if ($('benchMultiReport')) {
                    let text = '';
                    for (let m in report.multiLayerTest) {
                        let count = m.replace('_layers', ' шарів');
                        text += `• <b>${count}</b>: ${report.multiLayerTest[m].avgMs} ms (${report.multiLayerTest[m].fps} FPS)<br>`;
                    }
                    $('benchMultiReport').innerHTML = text;
                }

                if ($('benchStressReport')) {
                    $('benchStressReport').innerHTML = `
                        • Час 30 змін параметрів: <b>${report.stressTest.edits30TimeMs} ms</b> (середній: ${report.stressTest.avgMsPerEdit} ms/зміна)<br>
                        • Використання пам'яті до/після: <b>${report.stressTest.startMemMB} MB → ${report.stressTest.endMemMB} MB</b> (дельта: ${report.stressTest.memoryDeltaMB} MB)
                    `;
                }
            }
        };

        // --- Realtime FPS Ticker ---
        (function initRealtimeFpsMeter() {
            let lastTime = performance.now();
            let frameCount = 0;
            function fpsTick() {
                let now = performance.now();
                frameCount++;
                if (now - lastTime >= 500) {
                    let calculatedFps = Math.min(120, Math.round((frameCount * 1000) / (now - lastTime)));
                    frameCount = 0;
                    lastTime = now;
                    let fpsEl = $('fpsInfo');
                    if (fpsEl) {
                        fpsEl.textContent = `${calculatedFps} FPS`;
                    }
                }
                requestAnimationFrame(fpsTick);
            }
            requestAnimationFrame(fpsTick);
        })();
