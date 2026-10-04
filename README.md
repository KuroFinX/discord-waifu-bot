# 🌸 Anime & Catgirl Discord Bot

Ein moderner Discord.js (v14) Bot zum Abrufen von zufälligen Anime- und Catgirl-Bildern inklusive Buttons zum Neu-Laden und Ephemeral-Option (nur für den Benutzer sichtbar).

## 🚀 Features

- **`/cat`**: Sendet ein zufälliges Catgirl-Bild (Nekosia API).
- **`/waifu`**: Sendet ein zufälliges Anime-Bild mit wählbaren Kategorien (Waifu, Neko, Fox Girl via Nekos.life API).
- **Interactive Reload:** Mit dem Button `🔄 Neues Bild` kann direkt in der Nachricht ein neues Bild angefordert werden.
- **Privacy Option:** Mit dem `hidden`-Parameter kann eingestellt werden, ob das Bild nur für einen selbst oder für alle im Channel sichtbar ist.
- **Cloudflare & SSL Safe:** Verwendet native Node.js `fetch`-Anfragen zur Vermeidung von TLS- und Cloudflare-Blockaden.

## 📦 Voraussetzungen

- **Node.js** v18.0.0 oder höher
- Discord Application & Bot Token aus dem [Discord Developer Portal](https://discord.com/developers/applications)

## 🛠️ Installation

1. Repositorium klonen oder herunterladen:
   ```bash
   git clone [https://github.com/DEIN_USERNAME/DEIN_REPO.git](https://github.com/DEIN_USERNAME/DEIN_REPO.git)
   cd DEIN_REPO
