import sys
import os
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import threading
from adb_automation import ADBAutomationEngine

class ADBApp:
    def __init__(self, root):
        self.root = root
        self.root.title("ADB (adbs.uab.gov.tr) Otomatik Eğitim İzleyici v1.0")
        self.root.geometry("780x580")
        self.root.minsize(700, 500)
        self.root.configure(bg="#0f172a")

        self.engine = ADBAutomationEngine(
            log_callback=self.log_message,
            status_callback=self.update_status
        )

        self._setup_styles()
        self._build_ui()

    def _setup_styles(self):
        style = ttk.Style()
        style.theme_use('default')
        style.configure('.', background='#0f172a', foreground='#f8fafc')
        style.configure('TFrame', background='#0f172a')
        style.configure('Header.TLabel', font=('Segoe UI', 14, 'bold'), foreground='#38bdf8', background='#0f172a')
        style.configure('Status.TLabel', font=('Segoe UI', 10, 'bold'), foreground='#22c55e', background='#1e293b')
        style.configure('TCheckbutton', background='#0f172a', foreground='#f8fafc', font=('Segoe UI', 10))

    def _build_ui(self):
        # Header Container
        header_frame = tk.Frame(self.root, bg="#1e293b", height=60, bd=0)
        header_frame.pack(fill=tk.X, side=tk.TOP)

        title_label = tk.Label(
            header_frame, 
            text="⚓ ADB Otomatik Eğitim İzleyici", 
            font=("Segoe UI", 14, "bold"), 
            fg="#38bdf8", 
            bg="#1e293b"
        )
        title_label.pack(side=tk.LEFT, padx=16, pady=12)

        self.status_label = tk.Label(
            header_frame,
            text="● Kapalı",
            font=("Segoe UI", 10, "bold"),
            fg="#ef4444",
            bg="#1e293b"
        )
        self.status_label.pack(side=tk.RIGHT, padx=16, pady=12)

        # Control Panel Body
        body_frame = tk.Frame(self.root, bg="#0f172a")
        body_frame.pack(fill=tk.BOTH, expand=True, padx=16, pady=12)

        # Action Buttons Grid Container
        btn_frame = tk.Frame(body_frame, bg="#0f172a")
        btn_frame.pack(fill=tk.X, pady=(0, 12))

        # Grid configuration
        btn_frame.columnconfigure(0, weight=1)
        btn_frame.columnconfigure(1, weight=1)
        btn_frame.columnconfigure(2, weight=1)
        btn_frame.columnconfigure(3, weight=1)

        # Row 1 Buttons: Primary Actions
        self.btn_launch = tk.Button(
            btn_frame,
            text="🚀 1. Tarayıcıyı Aç & Giriş Yap",
            font=("Segoe UI", 10, "bold"),
            bg="#0284c7",
            fg="white",
            activebackground="#0369a1",
            activeforeground="white",
            relief=tk.FLAT,
            padx=10,
            pady=10,
            cursor="hand2",
            command=self.on_launch_browser
        )
        self.btn_launch.grid(row=0, column=0, columnspan=2, sticky="nsew", padx=4, pady=4)

        self.btn_start = tk.Button(
            btn_frame,
            text="▶️ 2. Otomasyonu Başlat",
            font=("Segoe UI", 10, "bold"),
            bg="#22c55e",
            fg="white",
            activebackground="#16a34a",
            activeforeground="white",
            relief=tk.FLAT,
            padx=10,
            pady=10,
            cursor="hand2",
            state=tk.NORMAL,  # Keep enabled so it's always visible and clickable
            command=self.on_start_automation
        )
        self.btn_start.grid(row=0, column=2, columnspan=2, sticky="nsew", padx=4, pady=4)

        # Row 2 Buttons: Control Actions
        self.btn_pause = tk.Button(
            btn_frame,
            text="⏸️ Duraklat / Devam Ettir",
            font=("Segoe UI", 9, "bold"),
            bg="#eab308",
            fg="white",
            activebackground="#ca8a04",
            activeforeground="white",
            relief=tk.FLAT,
            padx=8,
            pady=6,
            cursor="hand2",
            command=self.on_pause_automation
        )
        self.btn_pause.grid(row=1, column=0, columnspan=2, sticky="nsew", padx=4, pady=4)

        self.btn_stop = tk.Button(
            btn_frame,
            text="🛑 Tarayıcıyı Kapat",
            font=("Segoe UI", 9, "bold"),
            bg="#ef4444",
            fg="white",
            activebackground="#dc2626",
            activeforeground="white",
            relief=tk.FLAT,
            padx=8,
            pady=6,
            cursor="hand2",
            command=self.on_stop
        )
        self.btn_stop.grid(row=1, column=2, columnspan=2, sticky="nsew", padx=4, pady=4)

        # Settings Card
        settings_frame = tk.LabelFrame(
            body_frame,
            text=" ⚙️ Otomasyon Ayarları ",
            font=("Segoe UI", 10, "bold"),
            fg="#94a3b8",
            bg="#1e293b",
            bd=1,
            relief=tk.SOLID
        )
        settings_frame.pack(fill=tk.X, pady=(0, 12), ipady=6, ipadx=6)

        # Speed row
        speed_label = tk.Label(settings_frame, text="Oynatma Hızı:", font=("Segoe UI", 9, "bold"), fg="#f8fafc", bg="#1e293b")
        speed_label.grid(row=0, column=0, sticky=tk.W, padx=8, pady=4)

        self.speed_var = tk.StringVar(value="2.0x")
        speeds = ["1.0x (Normal)", "1.5x", "2.0x (Hızlı)", "4.0x (Çok Hızlı)", "8.0x (Maksimum)", "16.0x (Insta-Finish)"]
        self.speed_menu = ttk.Combobox(settings_frame, textvariable=self.speed_var, values=speeds, state="readonly", width=18)
        self.speed_menu.grid(row=0, column=1, sticky=tk.W, padx=8, pady=4)
        self.speed_menu.bind("<<ComboboxSelected>>", self.on_speed_changed)

        # Checkboxes
        self.mute_var = tk.BooleanVar(value=True)
        cb_mute = tk.Checkbutton(
            settings_frame,
            text="Videoları Sessize Al (Mute)",
            variable=self.mute_var,
            font=("Segoe UI", 9),
            fg="#f8fafc",
            bg="#1e293b",
            selectcolor="#0f172a",
            activebackground="#1e293b",
            activeforeground="#f8fafc",
            command=self.on_settings_changed
        )
        cb_mute.grid(row=0, column=2, sticky=tk.W, padx=16, pady=4)

        self.auto_next_var = tk.BooleanVar(value=True)
        cb_next = tk.Checkbutton(
            settings_frame,
            text="Otomatik Sonraki Ders",
            variable=self.auto_next_var,
            font=("Segoe UI", 9),
            fg="#f8fafc",
            bg="#1e293b",
            selectcolor="#0f172a",
            activebackground="#1e293b",
            activeforeground="#f8fafc",
            command=self.on_settings_changed
        )
        cb_next.grid(row=0, column=3, sticky=tk.W, padx=8, pady=4)

        # Log Window
        log_label = tk.Label(body_frame, text="📋 Canlı İzleme Günlüğü (Console Log):", font=("Segoe UI", 9, "bold"), fg="#94a3b8", bg="#0f172a")
        log_label.pack(anchor=tk.W, pady=(0, 4))

        self.log_text = scrolledtext.ScrolledText(
            body_frame,
            font=("Consolas", 9),
            bg="#090d16",
            fg="#38bdf8",
            insertbackground="white",
            relief=tk.SOLID,
            bd=1
        )
        self.log_text.pack(fill=tk.BOTH, expand=True)

        self.log_message("🤖 ADB Otomasyon Uygulaması Başlatıldı.")
        self.log_message("👉 Adım 1: '🚀 1. Tarayıcıyı Aç & Giriş Yap' butonuna tıklayınız.")
        self.log_message("👉 Adım 2: e-Devlet girişinizi tamamlayınca '▶️ 2. Otomasyonu Başlat' butonuna tıklayınız.")

    def log_message(self, msg: str):
        def append():
            self.log_text.insert(tk.END, msg + "\n")
            self.log_text.see(tk.END)
        self.root.after(0, append)

    def update_status(self, status: str):
        def update():
            color_map = {
                "Giriş Bekleniyor": ("● Giriş Bekleniyor", "#eab308"),
                "Çalışıyor": ("● Otomasyon Aktif", "#22c55e"),
                "Duraklatıldı": ("● Duraklatıldı", "#f97316"),
                "Durduruldu": ("● Kapalı", "#ef4444")
            }
            text, fg = color_map.get(status, (f"● {status}", "#94a3b8"))
            self.status_label.config(text=text, fg=fg)
        self.root.after(0, update)

    def on_launch_browser(self):
        self.log_message("🚀 Tarayıcı başlatılıyor, lütfen bekleyin...")
        threading.Thread(target=self._launch_thread, daemon=True).start()

    def _launch_thread(self):
        self.engine.launch_browser()

    def on_start_automation(self):
        if not self.engine.page:
            messagebox.showwarning("Uyarı", "Lütfen önce '1. Tarayıcıyı Aç & Giriş Yap' butonuna basarak tarayıcıyı başlatın ve giriş yapın.")
            return

        self.on_settings_changed()
        self.engine.start_automation_loop()
        self.log_message("▶️ Otomasyon başlatıldı. Videolar ve dersler taranıyor...")

    def on_pause_automation(self):
        if not self.engine.is_running:
            return
        if self.engine.is_paused:
            self.engine.resume()
            self.btn_pause.config(text="⏸️ Duraklat")
        else:
            self.engine.pause()
            self.btn_pause.config(text="▶️ Devam Ettir")

    def on_speed_changed(self, event=None):
        val = self.speed_var.get().split()[0].replace("x", "")
        try:
            self.engine.playback_speed = float(val)
            self.log_message(f"⚡ Oynatma hızı ayarlandı: {self.engine.playback_speed}x")
        except ValueError:
            pass

    def on_settings_changed(self):
        self.engine.mute_audio = self.mute_var.get()
        self.engine.auto_next = self.auto_next_var.get()
        self.on_speed_changed()

    def on_stop(self):
        self.engine.stop()

def main():
    root = tk.Tk()
    app = ADBApp(root)

    def on_closing():
        app.engine.stop()
        root.destroy()

    root.protocol("WM_DELETE_WINDOW", on_closing)
    root.mainloop()

if __name__ == "__main__":
    main()
