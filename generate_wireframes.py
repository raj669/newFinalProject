#!/usr/bin/env python3
"""
generate_wireframes.py  – generates pretty UI wireframe images for the report
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import matplotlib.patheffects as pe

OUTPUT_DIR = "/home/runner/work/newFinalProject/newFinalProject/diagrams"

# Colours
C_NAV       = "#1E40AF"
C_HERO      = "#1D4ED8"
C_CARD_BG   = "#FFFFFF"
C_CARD_BD   = "#CBD5E1"
C_SIDEBAR   = "#F1F5F9"
C_FILTER_BG = "#E2E8F0"
C_BTN       = "#2563EB"
C_BTN_TEXT  = "#FFFFFF"
C_TEXT      = "#1E293B"
C_SUB       = "#64748B"
C_FOOTER    = "#0F172A"
C_BADGE_G   = "#16A34A"
C_BADGE_O   = "#EA580C"
C_BG        = "#F8FAFC"
FONT        = "DejaVu Sans"


def save(fig, name):
    path = os.path.join(OUTPUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  Saved {name}")


def rounded_rect(ax, x, y, w, h, fc, ec, lw=1.0, alpha=1.0, zorder=2, radius="round,pad=0.04"):
    r = FancyBboxPatch((x, y), w, h, boxstyle=radius,
                       linewidth=lw, edgecolor=ec, facecolor=fc,
                       alpha=alpha, zorder=zorder)
    ax.add_patch(r)
    return r


def nav_bar(ax, x, y, w, h=0.35):
    rounded_rect(ax, x, y, w, h, C_NAV, C_NAV, lw=0, zorder=5)
    ax.text(x + 0.15, y + h/2, "Nepal Estates", ha="left", va="center",
            fontsize=9, fontweight="bold", color="white", fontfamily=FONT, zorder=6)
    for i, lbl in enumerate(["Home", "Properties", "Contact"]):
        ax.text(x + w - 0.2 - i * 1.0, y + h/2, lbl, ha="right", va="center",
                fontsize=8, color="white", fontfamily=FONT, zorder=6)


def footer_bar(ax, x, y, w, h=0.28):
    rounded_rect(ax, x, y, w, h, C_FOOTER, C_FOOTER, lw=0, zorder=5)
    ax.text(x + w/2, y + h/2,
            "© 2024 Nepal Estates · Kathmandu, Nepal · All rights reserved",
            ha="center", va="center", fontsize=7, color="#94A3B8",
            fontfamily=FONT, zorder=6)


# ═══════════════════════════════════════════════════════════════
# Figure A – Home Page Wireframe
# ═══════════════════════════════════════════════════════════════
def make_home_wireframe():
    fig, ax = plt.subplots(figsize=(10, 11))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 10); ax.set_ylim(0, 11)
    ax.axis("off")
    ax.set_title("Figure 3.8(a): Home Page (index.html) — UI Wireframe",
                 fontsize=13, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=10)

    # Nav
    nav_bar(ax, 0.3, 10.35, 9.4)

    # Hero section
    rounded_rect(ax, 0.3, 8.4, 9.4, 1.7, C_HERO, C_HERO, lw=0, zorder=3)
    ax.text(5.0, 9.55, "Find Your Dream Property in Nepal",
            ha="center", va="center", fontsize=12, fontweight="bold",
            color="white", fontfamily=FONT, zorder=4)
    # Search boxes
    for xi, lbl in [(1.0, "Status ▾"), (3.5, "Type ▾"), (6.0, "City ▾")]:
        rounded_rect(ax, xi, 8.65, 1.9, 0.38, "white", C_CARD_BD, lw=1, zorder=5)
        ax.text(xi + 0.95, 8.84, lbl, ha="center", va="center",
                fontsize=8, color=C_SUB, fontfamily=FONT, zorder=6)
    rounded_rect(ax, 8.05, 8.65, 1.5, 0.38, C_BTN, C_BTN, lw=0, zorder=5)
    ax.text(8.8, 8.84, "Search", ha="center", va="center",
            fontsize=8.5, fontweight="bold", color=C_BTN_TEXT,
            fontfamily=FONT, zorder=6)

    # Section heading
    ax.text(5.0, 8.15, "*  Featured Properties", ha="center", va="center",
            fontsize=11, fontweight="bold", color=C_TEXT, fontfamily=FONT)

    # 3 Property cards
    card_w, card_h = 2.7, 4.0
    for ci, (cname, price, beds, city, bcolor) in enumerate([
        ("Modern Apartment\n– Thamel", "NPR 8,500,000", "2 🛏  2 🚿  850 sqft", "Kathmandu", C_BADGE_G),
        ("Cozy Villa\n– Pokhara Lake Side", "NPR 25,000,000", "4 🛏  3 🚿  3,200 sqft", "Pokhara", C_BADGE_O),
        ("Commercial Space\n– New Baneshwor", "NPR 45,000,000", "0 🛏  2 🚿  1,800 sqft", "Kathmandu", C_BADGE_O),
    ]):
        cx = 0.65 + ci * 3.1
        cy = 3.85
        rounded_rect(ax, cx, cy, card_w, card_h, C_CARD_BG, C_CARD_BD,
                     lw=1.2, zorder=3, radius="round,pad=0.06")

        # Image placeholder
        rounded_rect(ax, cx + 0.05, cy + card_h - 1.45, card_w - 0.1, 1.35,
                     "#E2E8F0", "#CBD5E1", lw=1, zorder=4)
        ax.text(cx + card_w/2, cy + card_h - 0.75, "[IMG] Property Image",
                ha="center", va="center", fontsize=7.5, color=C_SUB,
                fontfamily=FONT, zorder=5)

        # Badge
        rounded_rect(ax, cx + 0.1, cy + card_h - 1.55, 0.65, 0.23,
                     bcolor, bcolor, lw=0, zorder=5)
        ax.text(cx + 0.43, cy + card_h - 1.44, "For Sale",
                ha="center", va="center", fontsize=6.5,
                color="white", fontfamily=FONT, zorder=6)

        # Text content
        ax.text(cx + 0.12, cy + card_h - 1.85, cname,
                ha="left", va="top", fontsize=8, fontweight="bold",
                color=C_TEXT, fontfamily=FONT, zorder=5)
        ax.text(cx + 0.12, cy + card_h - 2.5, price,
                ha="left", va="top", fontsize=9, fontweight="bold",
                color="#2563EB", fontfamily=FONT, zorder=5)
        ax.text(cx + 0.12, cy + card_h - 2.85, beds,
                ha="left", va="top", fontsize=7.5, color=C_SUB,
                fontfamily=FONT, zorder=5)
        ax.text(cx + 0.12, cy + card_h - 3.15, f"@ {city}",
                ha="left", va="top", fontsize=7.5, color=C_SUB,
                fontfamily=FONT, zorder=5)

        # Details button
        rounded_rect(ax, cx + 0.12, cy + 0.12, card_w - 0.24, 0.3,
                     C_BTN, C_BTN, lw=0, zorder=5, radius="round,pad=0.03")
        ax.text(cx + card_w/2, cy + 0.27, "View Details →",
                ha="center", va="center", fontsize=8, color="white",
                fontfamily=FONT, zorder=6)

    # Stats bar
    rounded_rect(ax, 0.3, 3.35, 9.4, 0.4, "#EFF6FF", "#BFDBFE", lw=1, zorder=3)
    for xi, stat in [(2.0, "🏘  500+ Properties"), (5.0, "@ 3+ Cities"), (8.0, "Tel 24/7 Support")]:
        ax.text(xi, 3.55, stat, ha="center", va="center",
                fontsize=8.5, fontweight="bold", color=C_BTN,
                fontfamily=FONT, zorder=4)

    # Footer
    footer_bar(ax, 0.3, 3.0, 9.4)

    save(fig, "wireframe_home.png")


# ═══════════════════════════════════════════════════════════════
# Figure B – Properties Listing Wireframe
# ═══════════════════════════════════════════════════════════════
def make_properties_wireframe():
    fig, ax = plt.subplots(figsize=(12, 10))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 12); ax.set_ylim(0, 10)
    ax.axis("off")
    ax.set_title("Figure 3.8(b): Properties Listing Page (properties.html) — UI Wireframe",
                 fontsize=13, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=10)

    nav_bar(ax, 0.3, 9.35, 11.4)

    # Page title strip
    rounded_rect(ax, 0.3, 8.8, 11.4, 0.45, "#DBEAFE", "#BFDBFE", lw=1, zorder=3)
    ax.text(6.0, 9.03, "Browse Properties  —  20 listings found",
            ha="center", va="center", fontsize=10, fontweight="bold",
            color=C_NAV, fontfamily=FONT, zorder=4)

    # ── SIDEBAR ────────────────────────────────────────────────────────────────
    sb_x, sb_y, sb_w, sb_h = 0.3, 0.6, 2.9, 8.1
    rounded_rect(ax, sb_x, sb_y, sb_w, sb_h, C_SIDEBAR, C_CARD_BD, lw=1, zorder=3)
    ax.text(sb_x + sb_w/2, sb_y + sb_h - 0.25,
            "Search & Filter", ha="center", va="center",
            fontsize=9, fontweight="bold", color=C_NAV, fontfamily=FONT, zorder=4)

    filters = [
        ("Status",    ["○ Buy",  "○ Rent"]),
        ("Type",      ["□ Apartment", "□ House", "□ Villa", "□ Commercial", "□ Land"]),
        ("City",      ["Kathmandu ▾"]),
        ("Price (NPR)", ["Min: ________", "Max: ________"]),
        ("Bedrooms",  ["Min bedrooms ▾"]),
        ("",          ["□ Featured Only"]),
    ]
    fy = sb_y + sb_h - 0.6
    for flabel, fopts in filters:
        if flabel:
            ax.text(sb_x + 0.15, fy, flabel, ha="left", va="center",
                    fontsize=8, fontweight="bold", color=C_TEXT,
                    fontfamily=FONT, zorder=4)
            fy -= 0.28
        for opt in fopts:
            if "____" in opt:
                rounded_rect(ax, sb_x + 0.15, fy - 0.16, sb_w - 0.3, 0.3,
                             "white", C_CARD_BD, lw=1, zorder=5)
                ax.text(sb_x + 0.3, fy, opt.replace("___", ""),
                        ha="left", va="center", fontsize=7.5, color=C_SUB,
                        fontfamily=FONT, zorder=6)
            elif "▾" in opt:
                rounded_rect(ax, sb_x + 0.15, fy - 0.16, sb_w - 0.3, 0.3,
                             "white", C_CARD_BD, lw=1, zorder=5)
                ax.text(sb_x + 0.3, fy, opt, ha="left", va="center",
                        fontsize=7.5, color=C_SUB, fontfamily=FONT, zorder=6)
            else:
                ax.text(sb_x + 0.2, fy, opt, ha="left", va="center",
                        fontsize=7.5, color=C_TEXT, fontfamily=FONT, zorder=4)
            fy -= 0.32

    # Search / Reset buttons
    rounded_rect(ax, sb_x + 0.15, fy - 0.15, 1.1, 0.3, C_BTN, C_BTN, lw=0, zorder=5)
    ax.text(sb_x + 0.7, fy, "Search", ha="center", va="center",
            fontsize=8, color="white", fontfamily=FONT, zorder=6)
    rounded_rect(ax, sb_x + 1.4, fy - 0.15, 1.1, 0.3, "white", C_CARD_BD, lw=1, zorder=5)
    ax.text(sb_x + 1.95, fy, "Reset", ha="center", va="center",
            fontsize=8, color=C_TEXT, fontfamily=FONT, zorder=6)

    # ── PROPERTY GRID ──────────────────────────────────────────────────────────
    grid_x = 3.4
    cols, rows = 2, 3
    card_w, card_h = 3.9, 2.4
    gap_x, gap_y = 0.25, 0.3

    listings = [
        ("Modern Apartment – Thamel", "NPR 8,500,000", "2🛏 2🚿 850sqft", "Kathmandu"),
        ("Villa – Lakeside Pokhara", "NPR 25,000,000", "4🛏 3🚿 3200sqft", "Pokhara"),
        ("Studio – Bhaktapur", "NPR 3,200,000", "1🛏 1🚿 420sqft", "Bhaktapur"),
        ("Commercial – New Baneshwor", "NPR 45,000,000", "0🛏 2🚿 1800sqft", "Kathmandu"),
        ("House – Sanepa", "NPR 18,000,000", "3🛏 2🚿 2400sqft", "Lalitpur"),
        ("Land – Godavari", "NPR 12,000,000", "0🛏 0🚿 5ropani", "Lalitpur"),
    ]
    for idx, (title, price, info, city) in enumerate(listings):
        col, row = idx % cols, idx // cols
        cx = grid_x + col * (card_w + gap_x)
        cy = 8.1 - row * (card_h + gap_y) - card_h
        rounded_rect(ax, cx, cy, card_w, card_h,
                     C_CARD_BG, C_CARD_BD, lw=1.2, zorder=3)
        # Image area
        rounded_rect(ax, cx + 0.05, cy + card_h - 1.0, card_w - 0.1, 0.88,
                     "#E2E8F0", "#CBD5E1", lw=1, zorder=4)
        ax.text(cx + card_w/2, cy + card_h - 0.56, "[IMG]",
                ha="center", va="center", fontsize=14, zorder=5)
        ax.text(cx + 0.12, cy + card_h - 1.15, title,
                ha="left", va="top", fontsize=7.5, fontweight="bold",
                color=C_TEXT, fontfamily=FONT, zorder=5)
        ax.text(cx + 0.12, cy + card_h - 1.5, price,
                ha="left", va="top", fontsize=8.5, fontweight="bold",
                color=C_BTN, fontfamily=FONT, zorder=5)
        ax.text(cx + 0.12, cy + card_h - 1.78, info + "  @" + city,
                ha="left", va="top", fontsize=7, color=C_SUB,
                fontfamily=FONT, zorder=5)
        rounded_rect(ax, cx + 0.12, cy + 0.1, card_w - 0.24, 0.28,
                     C_BTN, C_BTN, lw=0, zorder=5)
        ax.text(cx + card_w/2, cy + 0.24, "View Details →",
                ha="center", va="center", fontsize=7.5, color="white",
                fontfamily=FONT, zorder=6)

    # Load more button
    rounded_rect(ax, 5.5, 0.65, 3.0, 0.3, "white", C_BTN, lw=1.5, zorder=3)
    ax.text(7.0, 0.8, "Load More Properties ↓", ha="center", va="center",
            fontsize=8, color=C_BTN, fontfamily=FONT, zorder=4)

    footer_bar(ax, 0.3, 0.28, 11.4)
    save(fig, "wireframe_properties.png")


# ═══════════════════════════════════════════════════════════════
# Figure C – Property Detail Wireframe
# ═══════════════════════════════════════════════════════════════
def make_property_detail_wireframe():
    fig, ax = plt.subplots(figsize=(12, 12))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 12); ax.set_ylim(0, 12)
    ax.axis("off")
    ax.set_title("Figure 3.8(c): Property Detail Page (property.html) — UI Wireframe",
                 fontsize=13, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=10)

    nav_bar(ax, 0.3, 11.35, 11.4)

    # Breadcrumb
    ax.text(0.5, 11.1, "Home  >  Properties  >  Modern Apartment – Thamel",
            ha="left", va="center", fontsize=8, color=C_SUB, fontfamily=FONT)

    # ── MAIN COLUMN ────────────────────────────────────────────────────────────
    main_x, main_w = 0.3, 7.8

    # Main image
    rounded_rect(ax, main_x, 8.5, main_w, 2.4, "#E2E8F0", "#CBD5E1", lw=1.2, zorder=3)
    ax.text(main_x + main_w/2, 9.7, "[IMG]  Main Property Image (High Resolution)",
            ha="center", va="center", fontsize=10, color=C_SUB, fontfamily=FONT, zorder=4)

    # Thumbnails
    for ti in range(4):
        tx = main_x + ti * 1.95 + 0.05
        rounded_rect(ax, tx, 8.0, 1.7, 0.42, "#E2E8F0", "#CBD5E1", lw=1, zorder=3)
        ax.text(tx + 0.85, 8.21, f"[IMG] Img {ti+1}", ha="center", va="center",
                fontsize=7, color=C_SUB, fontfamily=FONT, zorder=4)

    # Property title & badges
    rounded_rect(ax, main_x, 6.95, main_w, 0.95, C_CARD_BG, C_CARD_BD, lw=1, zorder=3)
    ax.text(main_x + 0.2, 7.65,
            "Modern Apartment in Thamel, Kathmandu",
            ha="left", va="center", fontsize=11, fontweight="bold",
            color=C_TEXT, fontfamily=FONT, zorder=4)
    for bi, (blabel, bcolor) in enumerate([("For Sale", C_BADGE_G), ("Featured *", C_BTN)]):
        rounded_rect(ax, main_x + 0.2 + bi * 1.2, 6.98, 1.05, 0.25, bcolor, bcolor, lw=0, zorder=5)
        ax.text(main_x + 0.73 + bi * 1.2, 7.1, blabel, ha="center", va="center",
                fontsize=7, color="white", fontfamily=FONT, zorder=6)

    # Key stats row
    rounded_rect(ax, main_x, 6.1, main_w, 0.75, "#EFF6FF", "#BFDBFE", lw=1, zorder=3)
    stats = [
        ("NPR 8,500,000", "Price"),
        ("Apartment",     "Type"),
        ("2", "Bedrooms"),
        ("2", "Bathrooms"),
        ("850 sqft",     "Area"),
        ("Thamel",       "Location"),
    ]
    sw = main_w / len(stats)
    for si, (val, lbl) in enumerate(stats):
        sx = main_x + si * sw + sw/2
        ax.text(sx, 6.64, val, ha="center", va="center",
                fontsize=8.5, fontweight="bold", color=C_BTN, fontfamily=FONT, zorder=4)
        ax.text(sx, 6.35, lbl, ha="center", va="center",
                fontsize=7, color=C_SUB, fontfamily=FONT, zorder=4)

    # Features
    rounded_rect(ax, main_x, 5.0, main_w, 1.0, C_CARD_BG, C_CARD_BD, lw=1, zorder=3)
    ax.text(main_x + 0.2, 5.75, "Features:",
            ha="left", va="center", fontsize=9, fontweight="bold",
            color=C_TEXT, fontfamily=FONT, zorder=4)
    for fi, feat in enumerate(["[v] Parking", "[v] Security", "[v] Lift", "[v] Garden", "[v] CCTV"]):
        ax.text(main_x + 0.2 + fi * 1.5, 5.3, feat,
                ha="left", va="center", fontsize=8, color=C_BADGE_G,
                fontfamily=FONT, zorder=4)

    # Description
    rounded_rect(ax, main_x, 3.6, main_w, 1.3, C_CARD_BG, C_CARD_BD, lw=1, zorder=3)
    ax.text(main_x + 0.2, 4.65, "Description:",
            ha="left", va="center", fontsize=9, fontweight="bold",
            color=C_TEXT, fontfamily=FONT, zorder=4)
    ax.text(main_x + 0.2, 4.2,
            "A beautifully designed modern apartment in the heart of Thamel,\n"
            "offering stunning views and premium amenities. Fully furnished\n"
            "with modern fixtures, 24-hour security, and easy access to\n"
            "restaurants, shops, and public transport.",
            ha="left", va="center", fontsize=7.5, color=C_TEXT,
            fontfamily=FONT, zorder=4)

    # Contact block
    rounded_rect(ax, main_x, 2.5, main_w, 1.0, "#F0FDF4", "#BBF7D0", lw=1.5, zorder=3)
    ax.text(main_x + 0.2, 3.25, "Contact: 9801234567",
            ha="left", va="center", fontsize=9, fontweight="bold",
            color=C_TEXT, fontfamily=FONT, zorder=4)
    for bi, (blabel, bcolor) in enumerate([
        ("Call", C_BTN), ("WhatsApp", C_BADGE_G), ("Email", C_BADGE_O)
    ]):
        rounded_rect(ax, main_x + 0.2 + bi * 2.5, 2.55, 2.2, 0.35, bcolor, bcolor, lw=0, zorder=5)
        ax.text(main_x + 1.3 + bi * 2.5, 2.73, blabel, ha="center", va="center",
                fontsize=8, color="white", fontfamily=FONT, zorder=6)

    # ── SIMILAR PROPERTIES SIDEBAR ─────────────────────────────────────────────
    sb_x, sb_y, sb_w, sb_h = 8.3, 6.1, 3.3, 5.1
    rounded_rect(ax, sb_x, sb_y, sb_w, sb_h, C_SIDEBAR, C_CARD_BD, lw=1, zorder=3)
    ax.text(sb_x + sb_w/2, sb_y + sb_h - 0.28, "Similar Properties",
            ha="center", va="center", fontsize=9, fontweight="bold",
            color=C_NAV, fontfamily=FONT, zorder=4)
    for si in range(3):
        scy = sb_y + sb_h - 0.65 - si * 1.55
        rounded_rect(ax, sb_x + 0.15, scy - 1.3, sb_w - 0.3, 1.4,
                     C_CARD_BG, C_CARD_BD, lw=1, zorder=4)
        rounded_rect(ax, sb_x + 0.2, scy - 0.75, sb_w - 0.4, 0.6,
                     "#E2E8F0", "#CBD5E1", lw=1, zorder=5)
        ax.text(sb_x + sb_w/2, scy - 0.45, "[IMG]",
                ha="center", va="center", fontsize=11, zorder=6)
        ax.text(sb_x + 0.25, scy - 0.95, f"Property {si+1} – Kathmandu",
                ha="left", va="top", fontsize=7.5, fontweight="bold",
                color=C_TEXT, fontfamily=FONT, zorder=5)
        ax.text(sb_x + 0.25, scy - 1.2, f"NPR {(si+1)*5},500,000",
                ha="left", va="top", fontsize=7.5, color=C_BTN,
                fontfamily=FONT, zorder=5)

    footer_bar(ax, 0.3, 0.28, 11.4)
    save(fig, "wireframe_property_detail.png")


if __name__ == "__main__":
    print("Generating wireframe diagrams …")
    make_home_wireframe()
    make_properties_wireframe()
    make_property_detail_wireframe()
    print("Done.")
