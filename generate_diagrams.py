#!/usr/bin/env python3
"""
generate_diagrams.py
====================
Generates professional PNG diagram images for the Nepal Real Estate
Project Report. Outputs to the diagrams/ directory.
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe
import numpy as np

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diagrams")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Colour palette ──────────────────────────────────────────────────────────
C_BLUE      = "#2563EB"
C_BLUE_LITE = "#DBEAFE"
C_TEAL      = "#0D9488"
C_TEAL_LITE = "#CCFBF1"
C_PURPLE    = "#7C3AED"
C_PURPLE_LT = "#EDE9FE"
C_ORANGE    = "#EA580C"
C_ORANGE_LT = "#FFF7ED"
C_GREEN     = "#16A34A"
C_GREEN_LT  = "#DCFCE7"
C_GRAY      = "#6B7280"
C_GRAY_LT   = "#F3F4F6"
C_RED       = "#DC2626"
C_RED_LT    = "#FEE2E2"
C_YELLOW    = "#CA8A04"
C_YELLOW_LT = "#FEF9C3"
C_BG        = "#FAFAFA"
C_BORDER    = "#E5E7EB"

FONT = "DejaVu Sans"


def save(fig, name):
    path = os.path.join(OUTPUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches="tight",
                facecolor=fig.get_facecolor())
    plt.close(fig)
    print(f"  Saved {name}")


def box(ax, x, y, w, h, label, sublabel=None,
        fc=C_BLUE_LITE, ec=C_BLUE, lw=1.5,
        fs=10, bold=False, radius=0.02):
    rect = FancyBboxPatch((x - w/2, y - h/2), w, h,
                           boxstyle=f"round,pad=0",
                           linewidth=lw, edgecolor=ec, facecolor=fc,
                           zorder=3)
    ax.add_patch(rect)
    weight = "bold" if bold else "normal"
    if sublabel:
        ax.text(x, y + 0.02, label, ha="center", va="center",
                fontsize=fs, fontweight=weight, color=ec, zorder=4,
                fontfamily=FONT)
        ax.text(x, y - 0.08, sublabel, ha="center", va="center",
                fontsize=fs - 2, color=C_GRAY, zorder=4, fontfamily=FONT)
    else:
        ax.text(x, y, label, ha="center", va="center",
                fontsize=fs, fontweight=weight, color=ec, zorder=4,
                fontfamily=FONT)


def arrow(ax, x0, y0, x1, y1, label="", color=C_GRAY, lw=1.5,
          style="->", shrink=0.01):
    ax.annotate("", xy=(x1, y1), xytext=(x0, y0),
                arrowprops=dict(arrowstyle=style, color=color,
                                lw=lw, shrinkA=5, shrinkB=5),
                zorder=2)
    if label:
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        ax.text(mx + 0.01, my + 0.01, label, ha="center", va="bottom",
                fontsize=8, color=C_GRAY, fontfamily=FONT, zorder=5)


def dashed_arrow(ax, x0, y0, x1, y1, label="", color=C_GRAY, lw=1.2):
    ax.annotate("", xy=(x1, y1), xytext=(x0, y0),
                arrowprops=dict(arrowstyle="->", color=color, lw=lw,
                                linestyle="dashed", shrinkA=5, shrinkB=5),
                zorder=2)
    if label:
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        ax.text(mx + 0.01, my + 0.01, label, ha="center", va="bottom",
                fontsize=8, color=C_GRAY, fontfamily=FONT, zorder=5,
                style="italic")


def section_header(ax, x, y, text, color=C_BLUE):
    ax.text(x, y, text, ha="center", va="center",
            fontsize=11, fontweight="bold", color=color,
            fontfamily=FONT, zorder=5)
    ax.plot([x - 0.6, x + 0.6], [y - 0.035, y - 0.035],
            color=color, lw=1, zorder=4)


# ════════════════════════════════════════════════════════════════════════════
# 1.  ER DIAGRAM
# ════════════════════════════════════════════════════════════════════════════
def make_er_diagram():
    fig, ax = plt.subplots(figsize=(12, 7))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 12); ax.set_ylim(0, 7)
    ax.axis("off")
    ax.set_title("Figure 3.1: Entity-Relationship Diagram",
                 fontsize=14, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=12)

    # ── PROPERTIES entity (center) ───────────────────────────────────────────
    ex, ey = 6.0, 3.5
    ew, eh = 3.8, 5.8
    rect = FancyBboxPatch((ex - ew/2, ey - eh/2), ew, eh,
                           boxstyle="round,pad=0.05",
                           linewidth=2, edgecolor=C_BLUE, facecolor=C_BLUE_LITE,
                           zorder=3)
    ax.add_patch(rect)

    # Header band
    header = FancyBboxPatch((ex - ew/2, ey + eh/2 - 0.42), ew, 0.42,
                             boxstyle="round,pad=0.02",
                             linewidth=0, facecolor=C_BLUE, zorder=4)
    ax.add_patch(header)
    ax.text(ex, ey + eh/2 - 0.21, "PROPERTIES", ha="center", va="center",
            fontsize=12, fontweight="bold", color="white",
            fontfamily=FONT, zorder=5)

    attrs = [
        ("PK", "id", "integer"),
        ("",   "title", "string"),
        ("",   "type", "enum: apartment|house|villa|commercial|land"),
        ("",   "status", "enum(sale|rent)"),
        ("",   "price", "number (NPR)"),
        ("",   "bedrooms", "integer"),
        ("",   "bathrooms", "integer"),
        ("",   "area", "number"),
        ("",   "areaUnit", "enum(sqft|sqm)"),
        ("",   "city", "string"),
        ("",   "district", "string"),
        ("",   "address", "string"),
        ("",   "contact", "string"),
        ("",   "listedDate", "string (ISO)"),
        ("",   "featured", "boolean"),
    ]
    top_y = ey + eh/2 - 0.6
    row_h = (eh - 0.42) / (len(attrs) + 0.5)
    for idx, (pk, attr, atype) in enumerate(attrs):
        ry = top_y - idx * row_h - row_h / 2
        if idx % 2 == 0:
            stripe = FancyBboxPatch((ex - ew/2 + 0.04, ry - row_h/2 + 0.01),
                                     ew - 0.08, row_h - 0.02,
                                     boxstyle="square,pad=0",
                                     linewidth=0, facecolor="#EFF6FF", zorder=3)
            ax.add_patch(stripe)
        if pk:
            ax.text(ex - ew/2 + 0.18, ry, pk, ha="center", va="center",
                    fontsize=7.5, fontweight="bold", color=C_ORANGE,
                    fontfamily=FONT, zorder=5)
        ax.text(ex - ew/2 + 0.55, ry, attr, ha="left", va="center",
                fontsize=8.5, fontweight="bold" if pk else "normal",
                color="#1E293B", fontfamily=FONT, zorder=5)
        ax.text(ex + ew/2 - 0.08, ry, atype, ha="right", va="center",
                fontsize=7.5, color=C_GRAY, fontfamily=FONT,
                style="italic", zorder=5)

    # ── FEATURES entity (left) ────────────────────────────────────────────────
    fx, fy = 1.8, 5.2
    fw, fh = 2.8, 2.0
    rect2 = FancyBboxPatch((fx - fw/2, fy - fh/2), fw, fh,
                            boxstyle="round,pad=0.05",
                            linewidth=2, edgecolor=C_TEAL, facecolor=C_TEAL_LITE,
                            zorder=3)
    ax.add_patch(rect2)
    hdr2 = FancyBboxPatch((fx - fw/2, fy + fh/2 - 0.38), fw, 0.38,
                           boxstyle="round,pad=0.02",
                           linewidth=0, facecolor=C_TEAL, zorder=4)
    ax.add_patch(hdr2)
    ax.text(fx, fy + fh/2 - 0.19, "FEATURES", ha="center", va="center",
            fontsize=11, fontweight="bold", color="white",
            fontfamily=FONT, zorder=5)
    for idx, (pk, attr, atype) in enumerate([
        ("PK", "id", "integer"),
        ("FK", "property_id", "integer"),
        ("",   "feature_name", "string"),
        ("",   "feature_value", "string"),
    ]):
        ry = fy + fh/2 - 0.55 - idx * 0.34
        ax.text(fx - fw/2 + 0.18, ry, pk, ha="center", va="center",
                fontsize=7.5, fontweight="bold",
                color=C_ORANGE if pk == "PK" else C_RED,
                fontfamily=FONT, zorder=5)
        ax.text(fx - fw/2 + 0.42, ry, attr, ha="left", va="center",
                fontsize=8.5, color="#1E293B", fontfamily=FONT, zorder=5)
        ax.text(fx + fw/2 - 0.08, ry, atype, ha="right", va="center",
                fontsize=7.5, color=C_GRAY, fontfamily=FONT,
                style="italic", zorder=5)

    # ── IMAGES entity (left) ──────────────────────────────────────────────────
    ix, iy = 1.8, 1.9
    iw, ih = 2.8, 1.7
    rect3 = FancyBboxPatch((ix - iw/2, iy - ih/2), iw, ih,
                            boxstyle="round,pad=0.05",
                            linewidth=2, edgecolor=C_PURPLE, facecolor=C_PURPLE_LT,
                            zorder=3)
    ax.add_patch(rect3)
    hdr3 = FancyBboxPatch((ix - iw/2, iy + ih/2 - 0.38), iw, 0.38,
                           boxstyle="round,pad=0.02",
                           linewidth=0, facecolor=C_PURPLE, zorder=4)
    ax.add_patch(hdr3)
    ax.text(ix, iy + ih/2 - 0.19, "IMAGES", ha="center", va="center",
            fontsize=11, fontweight="bold", color="white",
            fontfamily=FONT, zorder=5)
    for idx, (pk, attr, atype) in enumerate([
        ("PK", "id", "integer"),
        ("FK", "property_id", "integer"),
        ("",   "image_path", "string"),
    ]):
        ry = iy + ih/2 - 0.55 - idx * 0.34
        ax.text(ix - iw/2 + 0.18, ry, pk, ha="center", va="center",
                fontsize=7.5, fontweight="bold",
                color=C_ORANGE if pk == "PK" else C_RED,
                fontfamily=FONT, zorder=5)
        ax.text(ix - iw/2 + 0.42, ry, attr, ha="left", va="center",
                fontsize=8.5, color="#1E293B", fontfamily=FONT, zorder=5)
        ax.text(ix + iw/2 - 0.08, ry, atype, ha="right", va="center",
                fontsize=7.5, color=C_GRAY, fontfamily=FONT,
                style="italic", zorder=5)

    # ── Relationship lines ────────────────────────────────────────────────────
    # PROPERTIES ← 1:N → FEATURES
    ax.annotate("", xy=(fx + fw/2, fy), xytext=(ex - ew/2, 4.5),
                arrowprops=dict(arrowstyle="-", color=C_TEAL, lw=2, shrinkA=3, shrinkB=3),
                zorder=2)
    ax.text(3.25, 4.65, "1 : N", ha="center", va="bottom",
            fontsize=9, fontweight="bold", color=C_TEAL,
            fontfamily=FONT, zorder=5)

    # PROPERTIES ← 1:N → IMAGES
    ax.annotate("", xy=(ix + iw/2, iy + 0.3), xytext=(ex - ew/2, 2.5),
                arrowprops=dict(arrowstyle="-", color=C_PURPLE, lw=2, shrinkA=3, shrinkB=3),
                zorder=2)
    ax.text(3.25, 2.25, "1 : N", ha="center", va="bottom",
            fontsize=9, fontweight="bold", color=C_PURPLE,
            fontfamily=FONT, zorder=5)

    # Legend
    legend_items = [
        mpatches.Patch(facecolor=C_BLUE_LITE, edgecolor=C_BLUE, label="Primary Entity"),
        mpatches.Patch(facecolor=C_TEAL_LITE, edgecolor=C_TEAL, label="Features Entity"),
        mpatches.Patch(facecolor=C_PURPLE_LT, edgecolor=C_PURPLE, label="Images Entity"),
    ]
    ax.legend(handles=legend_items, loc="lower right",
              fontsize=8, framealpha=0.9, edgecolor=C_BORDER)

    save(fig, "er_diagram.png")


# ════════════════════════════════════════════════════════════════════════════
# 2.  USE CASE DIAGRAM
# ════════════════════════════════════════════════════════════════════════════
def make_use_case_diagram():
    fig, ax = plt.subplots(figsize=(12, 8))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 12); ax.set_ylim(0, 8)
    ax.axis("off")
    ax.set_title("Figure 3.2: Use Case Diagram – Nepal Real Estate System",
                 fontsize=14, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=12)

    # System boundary rectangle
    sys_rect = FancyBboxPatch((2.8, 0.4), 8.4, 7.2,
                               boxstyle="round,pad=0.1",
                               linewidth=2, edgecolor=C_BLUE,
                               facecolor="white", zorder=1)
    ax.add_patch(sys_rect)
    ax.text(7.0, 7.45, "Nepal Real Estate Web Application",
            ha="center", va="center", fontsize=12, fontweight="bold",
            color=C_BLUE, fontfamily=FONT)

    # ── Use cases (ovals) ─────────────────────────────────────────────────────
    use_cases = [
        (7.0, 6.4,  "UC1: View All Properties"),
        (7.0, 5.5,  "UC2: Search by Filters"),
        (7.0, 4.6,  "UC3: View Property Details"),
        (7.0, 3.7,  "UC4: View Featured Properties"),
        (7.0, 2.8,  "UC5: Browse by Category"),
        (7.0, 1.9,  "UC6: Contact Property Owner"),
        (4.2, 4.15, "UC7: Filter by Price Range"),
        (9.8, 4.15, "UC8: Filter by Location"),
        (4.2, 3.25, "UC9: Filter by Bedroom Count"),
    ]

    for ux, uy, ulabel in use_cases:
        ell = mpatches.Ellipse((ux, uy), 2.8, 0.55,
                               linewidth=1.5, edgecolor=C_TEAL,
                               facecolor=C_TEAL_LITE, zorder=3)
        ax.add_patch(ell)
        ax.text(ux, uy, ulabel, ha="center", va="center",
                fontsize=8.5, color=C_TEAL, fontfamily=FONT,
                fontweight="bold", zorder=4)

    # ── Actors ────────────────────────────────────────────────────────────────
    def draw_actor(ax, x, y, label, color=C_BLUE):
        # head
        head = plt.Circle((x, y + 0.55), 0.18, color=color, zorder=5)
        ax.add_patch(head)
        # body
        ax.plot([x, x], [y + 0.37, y - 0.1], color=color, lw=2, zorder=5)
        # arms
        ax.plot([x - 0.3, x + 0.3], [y + 0.15, y + 0.15], color=color, lw=2, zorder=5)
        # legs
        ax.plot([x, x - 0.25], [y - 0.1, y - 0.55], color=color, lw=2, zorder=5)
        ax.plot([x, x + 0.25], [y - 0.1, y - 0.55], color=color, lw=2, zorder=5)
        ax.text(x, y - 0.75, label, ha="center", va="top",
                fontsize=9, fontweight="bold", color=color, fontfamily=FONT)

    draw_actor(ax, 1.5, 4.0, "User\n(Buyer/Renter)", C_BLUE)
    draw_actor(ax, 10.9, 4.0, "Property\nManager", C_ORANGE)

    # ── Association lines ─────────────────────────────────────────────────────
    uc_positions = {uc[2]: (uc[0], uc[1]) for uc in use_cases}
    user_ucs = ["UC1: View All Properties", "UC2: Search by Filters",
                "UC3: View Property Details", "UC4: View Featured Properties",
                "UC5: Browse by Category", "UC6: Contact Property Owner",
                "UC7: Filter by Price Range", "UC8: Filter by Location",
                "UC9: Filter by Bedroom Count"]
    mgr_ucs  = ["UC1: View All Properties", "UC4: View Featured Properties"]

    for uc in user_ucs:
        ux, uy = uc_positions[uc]
        ax.plot([1.8, ux - 1.4], [4.55, uy], color=C_GRAY,
                lw=0.8, zorder=2, alpha=0.6)

    for uc in mgr_ucs:
        ux, uy = uc_positions[uc]
        ax.plot([10.6, ux + 1.4], [4.55, uy], color=C_GRAY,
                lw=0.8, zorder=2, alpha=0.6)

    # ── Include relationships ─────────────────────────────────────────────────
    includes = [
        ("UC2: Search by Filters", "UC7: Filter by Price Range"),
        ("UC2: Search by Filters", "UC8: Filter by Location"),
        ("UC2: Search by Filters", "UC9: Filter by Bedroom Count"),
    ]
    for src, tgt in includes:
        sx, sy = uc_positions[src]
        tx, ty = uc_positions[tgt]
        dashed_arrow(ax, sx - 1.4, sy, tx + 1.4, ty,
                     label="«include»", color=C_PURPLE, lw=1.0)

    save(fig, "use_case_diagram.png")


# ════════════════════════════════════════════════════════════════════════════
# 3.  DFD LEVEL 0 — Context Diagram
# ════════════════════════════════════════════════════════════════════════════
def make_dfd_level0():
    fig, ax = plt.subplots(figsize=(10, 6))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 10); ax.set_ylim(0, 6)
    ax.axis("off")
    ax.set_title("Figure 3.3: DFD Level 0 – Context Diagram",
                 fontsize=14, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=12)

    # Central process bubble
    proc = plt.Circle((5.0, 3.0), 1.5, linewidth=2, edgecolor=C_BLUE,
                       facecolor=C_BLUE_LITE, zorder=3)
    ax.add_patch(proc)
    ax.text(5.0, 3.1, "Nepal Real Estate", ha="center", va="center",
            fontsize=10, fontweight="bold", color=C_BLUE,
            fontfamily=FONT, zorder=4)
    ax.text(5.0, 2.8, "Web Application", ha="center", va="center",
            fontsize=9, color=C_BLUE, fontfamily=FONT, zorder=4)

    # External entities (rectangles)
    entities = [
        (1.2, 5.0, 2.0, 0.65, "User / Browser",          C_TEAL,   C_TEAL_LITE),
        (8.8, 5.0, 2.0, 0.65, "Property Manager",         C_ORANGE, C_ORANGE_LT),
        (1.2, 1.0, 2.0, 0.65, "JSON File Storage",        C_GREEN,  C_GREEN_LT),
        (8.8, 1.0, 2.0, 0.65, "Static Asset Server",      C_PURPLE, C_PURPLE_LT),
    ]
    for ex, ey, ew, eh, elabel, ec, efc in entities:
        rect = FancyBboxPatch((ex - ew/2, ey - eh/2), ew, eh,
                               boxstyle="round,pad=0.06",
                               linewidth=2, edgecolor=ec, facecolor=efc, zorder=3)
        ax.add_patch(rect)
        ax.text(ex, ey, elabel, ha="center", va="center",
                fontsize=9, fontweight="bold", color=ec,
                fontfamily=FONT, zorder=4)

    # Data flows (arrows)
    flows = [
        # (x0, y0, x1, y1, label, dx_label, dy_label, color)
        (1.2, 4.68, 3.6, 3.6,   "Search Criteria\n(HTTP Request)",  0.1, 0.12, C_TEAL),
        (3.6, 3.0,  2.2, 4.68,  "Property Results\n(JSON Response)", -0.2, 0.0, C_GREEN),
        (8.8, 4.68, 6.4, 3.6,   "Admin Updates",                     0.0, 0.12, C_ORANGE),
        (1.2, 1.32, 3.6, 2.4,   "Read Properties",                   0.1, -0.1, C_GREEN),
        (6.4, 2.4,  8.8, 1.32,  "HTML / CSS / JS",                  0.0, 0.1, C_PURPLE),
    ]
    for x0, y0, x1, y1, flabel, dlx, dly, fc in flows:
        ax.annotate("", xy=(x1, y1), xytext=(x0, y0),
                    arrowprops=dict(arrowstyle="-|>", color=fc, lw=2,
                                   shrinkA=6, shrinkB=6), zorder=2)
        mx, my = (x0 + x1) / 2 + dlx, (y0 + y1) / 2 + dly
        ax.text(mx, my, flabel, ha="center", va="center",
                fontsize=7.5, color=fc, fontfamily=FONT,
                fontweight="bold", zorder=5,
                bbox=dict(boxstyle="round,pad=0.1", facecolor="white",
                          edgecolor="none", alpha=0.85))

    save(fig, "dfd_level0.png")


# ════════════════════════════════════════════════════════════════════════════
# 4.  DFD LEVEL 1
# ════════════════════════════════════════════════════════════════════════════
def make_dfd_level1():
    fig, ax = plt.subplots(figsize=(13, 9))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 13); ax.set_ylim(0, 9)
    ax.axis("off")
    ax.set_title("Figure 3.4: DFD Level 1 – Detailed Process Flow",
                 fontsize=14, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=12)

    def proc_circle(ax, x, y, r, label, num, ec=C_BLUE, fc=C_BLUE_LITE):
        c = plt.Circle((x, y), r, linewidth=2, edgecolor=ec, facecolor=fc, zorder=3)
        ax.add_patch(c)
        ax.text(x, y + 0.1, f"P{num}", ha="center", va="center",
                fontsize=8, fontweight="bold", color=ec,
                fontfamily=FONT, zorder=4)
        ax.text(x, y - 0.18, label, ha="center", va="center",
                fontsize=7.5, color=ec, fontfamily=FONT, zorder=4)

    def datastore(ax, x, y, w, h, label, ec=C_GREEN, fc=C_GREEN_LT):
        rect = FancyBboxPatch((x - w/2, y - h/2), w, h,
                               boxstyle="square,pad=0",
                               linewidth=1.8, edgecolor=ec, facecolor=fc, zorder=3)
        ax.add_patch(rect)
        # Open sides top/bottom to show it's a datastore
        ax.plot([x - w/2, x + w/2], [y + h/2, y + h/2], color=ec, lw=1.8, zorder=4)
        ax.plot([x - w/2, x + w/2], [y - h/2, y - h/2], color=ec, lw=1.8, zorder=4)
        ax.text(x, y, label, ha="center", va="center",
                fontsize=9, fontweight="bold", color=ec,
                fontfamily=FONT, zorder=5)

    def ext_entity(ax, x, y, w, h, label, ec=C_TEAL, fc=C_TEAL_LITE):
        rect = FancyBboxPatch((x - w/2, y - h/2), w, h,
                               boxstyle="round,pad=0.06",
                               linewidth=2, edgecolor=ec, facecolor=fc, zorder=3)
        ax.add_patch(rect)
        ax.text(x, y, label, ha="center", va="center",
                fontsize=9, fontweight="bold", color=ec,
                fontfamily=FONT, zorder=4)

    # ── Entities ──────────────────────────────────────────────────────────────
    ext_entity(ax, 1.2, 7.5, 2.0, 0.65, "User / Browser")
    ext_entity(ax, 1.2, 4.5, 2.0, 0.65, "User / Browser")
    ext_entity(ax, 1.2, 1.5, 2.0, 0.65, "User / Browser")
    datastore(ax, 11.0, 4.5, 2.8, 0.55, "DS: properties.json")

    # ── Processes ─────────────────────────────────────────────────────────────
    proc_circle(ax, 4.5, 7.5, 0.9, "API Router /\nExpress Routes", "1")
    proc_circle(ax, 7.5, 7.5, 0.9, "Validate &\nFilter Params", "2", C_TEAL, C_TEAL_LITE)
    proc_circle(ax, 7.5, 4.5, 0.9, "Execute Filter\nQuery", "3", C_PURPLE, C_PURPLE_LT)
    proc_circle(ax, 7.5, 1.5, 0.9, "Format API\nResponse", "4", C_ORANGE, C_ORANGE_LT)
    proc_circle(ax, 4.5, 1.5, 0.9, "Return HTTP\nResponse", "5")

    # ── Arrows ────────────────────────────────────────────────────────────────
    def aflow(ax, x0, y0, x1, y1, lbl="", c=C_GRAY, lw=1.5):
        ax.annotate("", xy=(x1, y1), xytext=(x0, y0),
                    arrowprops=dict(arrowstyle="-|>", color=c, lw=lw,
                                   shrinkA=6, shrinkB=6), zorder=2)
        if lbl:
            mx, my = (x0+x1)/2, (y0+y1)/2
            ax.text(mx, my + 0.12, lbl, ha="center", va="bottom",
                    fontsize=7.5, color=c, fontfamily=FONT,
                    bbox=dict(boxstyle="round,pad=0.08", facecolor="white",
                              edgecolor="none", alpha=0.85), zorder=5)

    aflow(ax, 2.2, 7.5, 3.6, 7.5, "HTTP Request", C_TEAL)
    aflow(ax, 5.4, 7.5, 6.6, 7.5, "Route + Params", C_BLUE)
    aflow(ax, 7.5, 6.6, 7.5, 5.4, "Valid Criteria", C_TEAL)
    aflow(ax, 8.4, 4.5, 10.6, 4.5, "Read Query", C_GREEN)
    aflow(ax, 10.6, 4.2, 8.4, 4.2, "Property Data", C_GREEN)
    aflow(ax, 7.5, 3.6, 7.5, 2.4, "Filtered Results", C_PURPLE)
    aflow(ax, 6.6, 1.5, 5.4, 1.5, "JSON Response", C_ORANGE)
    aflow(ax, 3.6, 1.5, 2.2, 1.5, "HTTP Response", C_BLUE)

    # Filter API to response (direct path for /id)
    aflow(ax, 2.2, 4.5, 3.6, 4.5, "GET /api/\nproperties/:id", C_TEAL)
    aflow(ax, 5.4, 4.8, 6.6, 4.8, "Route Match", C_BLUE)
    aflow(ax, 5.4, 4.2, 6.6, 4.2, "Property ID", C_BLUE)

    # Legend
    handles = [
        mpatches.Patch(facecolor=C_BLUE_LITE, edgecolor=C_BLUE, label="Process (Node.js/Express)"),
        mpatches.Patch(facecolor=C_TEAL_LITE, edgecolor=C_TEAL, label="External Entity (Browser)"),
        mpatches.Patch(facecolor=C_GREEN_LT,  edgecolor=C_GREEN, label="Data Store (JSON File)"),
    ]
    ax.legend(handles=handles, loc="lower right", fontsize=8,
              framealpha=0.9, edgecolor=C_BORDER)

    save(fig, "dfd_level1.png")


# ════════════════════════════════════════════════════════════════════════════
# 5.  CLASS DIAGRAM
# ════════════════════════════════════════════════════════════════════════════
def make_class_diagram():
    fig, ax = plt.subplots(figsize=(14, 8.5))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 14); ax.set_ylim(0, 8.5)
    ax.axis("off")
    ax.set_title("Figure 3.5: Class Diagram",
                 fontsize=14, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=12)

    def class_box(ax, x, y, name, attrs, methods,
                  ec=C_BLUE, fc=C_BLUE_LITE, width=3.0):
        row_h = 0.28
        header_h = 0.42
        body_h = (len(attrs) + len(methods) + 1) * row_h + 0.1  # +1 separator
        total_h = header_h + body_h
        bx, by = x - width/2, y - total_h

        # Outer border
        rect = FancyBboxPatch((bx, by), width, total_h,
                               boxstyle="round,pad=0.04",
                               linewidth=2, edgecolor=ec, facecolor=fc, zorder=3)
        ax.add_patch(rect)

        # Header
        hdr = FancyBboxPatch((bx, y - header_h), width, header_h,
                              boxstyle="round,pad=0.02",
                              linewidth=0, facecolor=ec, zorder=4)
        ax.add_patch(hdr)
        ax.text(x, y - header_h/2, name, ha="center", va="center",
                fontsize=10, fontweight="bold", color="white",
                fontfamily=FONT, zorder=5)

        cy = y - header_h - 0.1
        # Attributes
        for attr in attrs:
            cy -= row_h
            if cy % (2 * row_h) < row_h:
                stripe = FancyBboxPatch((bx + 0.04, cy - row_h/2 + 0.01),
                                        width - 0.08, row_h - 0.02,
                                        boxstyle="square,pad=0",
                                        linewidth=0, facecolor="white",
                                        alpha=0.4, zorder=3)
                ax.add_patch(stripe)
            ax.text(bx + 0.15, cy, attr, ha="left", va="center",
                    fontsize=7.5, color="#1E293B", fontfamily=FONT, zorder=5)

        # Separator line
        cy -= 0.05
        ax.plot([bx + 0.05, bx + width - 0.05], [cy, cy],
                color=ec, lw=1, alpha=0.6, zorder=4)
        cy -= 0.05

        # Methods
        for mth in methods:
            cy -= row_h
            ax.text(bx + 0.15, cy, mth, ha="left", va="center",
                    fontsize=7.5, color=C_GRAY, fontfamily=FONT,
                    style="italic", zorder=5)

        return (x, y - total_h / 2)  # midpoint

    # ── Property class (large, center) ───────────────────────────────────────
    class_box(ax, 7.0, 8.2, "Property",
              ["- id: number", "- title: string", "- type: PropertyType",
               "- status: StatusEnum", "- price: number",
               "- bedrooms: number", "- bathrooms: number",
               "- area: number",  "- city: string", "- featured: boolean"],
              ["+ getDetails(): void", "+ matchFilters(f): boolean",
               "+ toJSON(): object"],
              ec=C_BLUE, fc=C_BLUE_LITE, width=3.4)

    # ── Feature class (left top) ──────────────────────────────────────────────
    class_box(ax, 2.0, 7.2, "Feature",
              ["- name: string", "- value: string"],
              ["+ getValue(): string"],
              ec=C_TEAL, fc=C_TEAL_LITE, width=2.8)

    # ── Image class (left bottom) ─────────────────────────────────────────────
    class_box(ax, 2.0, 3.8, "Image",
              ["- path: string", "- uploadDate: string"],
              ["+ getURL(): string"],
              ec=C_PURPLE, fc=C_PURPLE_LT, width=2.8)

    # ── PropertyRepository class (right top) ──────────────────────────────────
    class_box(ax, 11.2, 7.6, "PropertyRepository",
              ["- properties: Property[]"],
              ["+ loadAll(): Property[]", "+ getById(id): Property",
               "+ search(filters): Property[]",
               "+ getFeatured(): Property[]", "+ save(p): void"],
              ec=C_ORANGE, fc=C_ORANGE_LT, width=3.2)

    # ── PropertyController class (right bottom) ───────────────────────────────
    class_box(ax, 11.2, 3.8, "PropertyController",
              ["- repository: PropertyRepository"],
              ["+ getAll(req, res): void", "+ getById(req, res): void",
               "+ search(req, res): void", "+ getFeatured(req, res): void"],
              ec=C_GREEN, fc=C_GREEN_LT, width=3.2)

    # ── PropertyValidator class (center bottom) ───────────────────────────────
    class_box(ax, 7.0, 2.4, "PropertyValidator",
              ["- validTypes: string[]", "- validStatuses: string[]"],
              ["+ validateFilters(f): boolean",
               "+ validatePrice(p): boolean",
               "+ validateId(id): boolean"],
              ec=C_RED, fc=C_RED_LT, width=3.2)

    # ── Relationships ─────────────────────────────────────────────────────────
    # Property ─◆─ Feature (composition)
    ax.annotate("", xy=(3.4, 5.7), xytext=(5.3, 4.35),
                arrowprops=dict(arrowstyle="-|>", color=C_TEAL, lw=1.5,
                                shrinkA=5, shrinkB=5), zorder=2)
    ax.text(4.2, 5.1, "1..*\ncomposition", ha="center",
            fontsize=7, color=C_TEAL, fontfamily=FONT)

    # Property ─◆─ Image (composition)
    ax.annotate("", xy=(3.4, 2.35), xytext=(5.3, 4.0),
                arrowprops=dict(arrowstyle="-|>", color=C_PURPLE, lw=1.5,
                                shrinkA=5, shrinkB=5), zorder=2)
    ax.text(4.1, 3.1, "1..*\ncomposition", ha="center",
            fontsize=7, color=C_PURPLE, fontfamily=FONT)

    # PropertyRepository uses Property
    ax.annotate("", xy=(8.7, 6.0), xytext=(9.6, 6.0),
                arrowprops=dict(arrowstyle="-|>", color=C_ORANGE, lw=1.5,
                                shrinkA=5, shrinkB=5), zorder=2)
    ax.text(9.15, 6.15, "uses", ha="center",
            fontsize=7.5, color=C_ORANGE, fontfamily=FONT)

    # PropertyController uses PropertyRepository
    ax.annotate("", xy=(9.6, 3.0), xytext=(9.6, 4.8),
                arrowprops=dict(arrowstyle="-|>", color=C_GREEN, lw=1.5,
                                shrinkA=5, shrinkB=5), zorder=2)
    ax.text(10.0, 3.9, "depends", ha="left",
            fontsize=7.5, color=C_GREEN, fontfamily=FONT)

    # PropertyController uses PropertyValidator
    ax.annotate("", xy=(8.7, 2.0), xytext=(9.6, 2.7),
                arrowprops=dict(arrowstyle="-|>", color=C_RED, lw=1.5,
                                shrinkA=5, shrinkB=5), zorder=2)
    ax.text(9.3, 2.2, "uses", ha="center",
            fontsize=7.5, color=C_RED, fontfamily=FONT)

    # Legend
    handles = [
        mpatches.Patch(facecolor=C_BLUE_LITE, edgecolor=C_BLUE, label="Domain Model (Property)"),
        mpatches.Patch(facecolor=C_TEAL_LITE, edgecolor=C_TEAL, label="Value Object (Feature)"),
        mpatches.Patch(facecolor=C_PURPLE_LT, edgecolor=C_PURPLE, label="Value Object (Image)"),
        mpatches.Patch(facecolor=C_ORANGE_LT, edgecolor=C_ORANGE, label="Repository"),
        mpatches.Patch(facecolor=C_GREEN_LT,  edgecolor=C_GREEN,  label="Controller"),
        mpatches.Patch(facecolor=C_RED_LT,    edgecolor=C_RED,    label="Validator"),
    ]
    ax.legend(handles=handles, loc="lower left", fontsize=7.5,
              framealpha=0.9, edgecolor=C_BORDER, ncol=2)

    save(fig, "class_diagram.png")


# ════════════════════════════════════════════════════════════════════════════
# 6.  SYSTEM ARCHITECTURE DIAGRAM
# ════════════════════════════════════════════════════════════════════════════
def make_architecture_diagram():
    fig, ax = plt.subplots(figsize=(12, 10))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 12); ax.set_ylim(0, 10)
    ax.axis("off")
    ax.set_title("Figure 3.6: System Architecture – Client-Server Tiers",
                 fontsize=14, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=12)

    def tier_box(ax, y_top, height, label, ec, fc_bg, items):
        rect = FancyBboxPatch((0.3, y_top - height), 11.4, height,
                               boxstyle="round,pad=0.08",
                               linewidth=2, edgecolor=ec, facecolor=fc_bg,
                               alpha=0.25, zorder=1)
        ax.add_patch(rect)
        # Tier label on left side
        ax.text(0.6, y_top - height/2, label, ha="left", va="center",
                fontsize=10, fontweight="bold", color=ec,
                fontfamily=FONT, rotation=90, zorder=3)
        # Component boxes
        n = len(items)
        slot_w = 10.0 / n
        for idx, (ilabel, isub) in enumerate(items):
            bx = 1.2 + idx * slot_w + slot_w/2
            by = y_top - height/2
            bw = slot_w - 0.3
            bh = height * 0.65
            b = FancyBboxPatch((bx - bw/2, by - bh/2), bw, bh,
                                boxstyle="round,pad=0.06",
                                linewidth=1.5, edgecolor=ec, facecolor="white",
                                zorder=2)
            ax.add_patch(b)
            ax.text(bx, by + 0.1, ilabel, ha="center", va="center",
                    fontsize=8.5, fontweight="bold", color=ec,
                    fontfamily=FONT, zorder=3)
            if isub:
                ax.text(bx, by - 0.18, isub, ha="center", va="center",
                        fontsize=7, color=C_GRAY, fontfamily=FONT, zorder=3)

    tier_box(ax, 9.7, 2.2, "CLIENT",
             C_TEAL, C_TEAL_LITE,
             [("HTML5 Pages", "index / properties\nproperty / contact"),
              ("CSS3 Styles", "Responsive Design\nMobile-First"),
              ("JavaScript (ES6+)", "Fetch API\nDOM Manipulation")])

    tier_box(ax, 7.2, 2.2, "SERVER",
             C_BLUE, C_BLUE_LITE,
             [("Node.js Runtime", "v18+ Engine"),
              ("Express.js", "Request Handling\nMiddleware Pipeline"),
              ("API Routes", "/api/properties\n/api/properties/:id")])

    tier_box(ax, 4.7, 2.2, "LOGIC",
             C_PURPLE, C_PURPLE_LT,
             [("CORS Middleware", "Cross-Origin\nRequest Handling"),
              ("Rate Limiter", "100 req / 15 min\nper IP"),
              ("Filter Engine", "type / status / city\nprice / bedrooms")])

    tier_box(ax, 2.2, 2.2, "DATA",
             C_GREEN, C_GREEN_LT,
             [("PropertyRepository", "Data Access\nOperations"),
              ("JSON Parser", "data/properties.json\nFile I/O"),
              ("Data Store", "properties.json\n20 sample listings")])

    # ── Vertical arrows between tiers ─────────────────────────────────────────
    for y_start, y_end, label_fwd, label_bck, color in [
        (7.5, 7.2,  "HTTP/HTTPS Request",  "JSON Response",       C_TEAL),
        (5.0, 4.7,  "Route Dispatch",       "Filtered Data",       C_BLUE),
        (2.5, 2.2,  "Read Request",         "Property Records",    C_GREEN),
    ]:
        # forward
        ax.annotate("", xy=(4.5, y_end), xytext=(4.5, y_start),
                    arrowprops=dict(arrowstyle="-|>", color=color, lw=2,
                                   shrinkA=0, shrinkB=0), zorder=4)
        ax.text(4.7, (y_start + y_end)/2, label_fwd, ha="left",
                va="center", fontsize=7.5, color=color,
                fontfamily=FONT, fontweight="bold", zorder=5)
        # backward
        ax.annotate("", xy=(7.5, y_start), xytext=(7.5, y_end),
                    arrowprops=dict(arrowstyle="-|>", color=color, lw=2,
                                   linestyle="dashed",
                                   shrinkA=0, shrinkB=0), zorder=4)
        ax.text(7.7, (y_start + y_end)/2, label_bck, ha="left",
                va="center", fontsize=7.5, color=color,
                fontfamily=FONT, fontweight="bold", zorder=5)

    save(fig, "architecture_diagram.png")


# ════════════════════════════════════════════════════════════════════════════
# 7.  COMPONENT DIAGRAM
# ════════════════════════════════════════════════════════════════════════════
def make_component_diagram():
    fig, ax = plt.subplots(figsize=(13, 10))
    fig.patch.set_facecolor(C_BG)
    ax.set_facecolor(C_BG)
    ax.set_xlim(0, 13); ax.set_ylim(0, 10)
    ax.axis("off")
    ax.set_title("Figure 3.7: Component Diagram",
                 fontsize=14, fontweight="bold", color="#1E293B",
                 fontfamily=FONT, pad=12)

    def layer_rect(ax, y_top, height, label, ec, fc_alpha=0.12):
        color_rgba = list(matplotlib.colors.to_rgba(fc_alpha if isinstance(fc_alpha, str) else ec))
        r = FancyBboxPatch((0.2, y_top - height), 12.6, height,
                           boxstyle="round,pad=0.08",
                           linewidth=1.5, edgecolor=ec,
                           facecolor=ec, alpha=0.08, zorder=1)
        ax.add_patch(r)
        ax.text(12.55, y_top - height/2, label,
                ha="right", va="center", fontsize=9.5, fontweight="bold",
                color=ec, fontfamily=FONT, zorder=2, alpha=0.7)

    def comp_box(ax, x, y, w, h, name, items, ec=C_BLUE, fc=C_BLUE_LITE):
        rect = FancyBboxPatch((x - w/2, y - h/2), w, h,
                               boxstyle="round,pad=0.06",
                               linewidth=1.8, edgecolor=ec, facecolor=fc, zorder=3)
        ax.add_patch(rect)
        hdr = FancyBboxPatch((x - w/2, y + h/2 - 0.38), w, 0.38,
                              boxstyle="round,pad=0.02",
                              linewidth=0, facecolor=ec, zorder=4)
        ax.add_patch(hdr)
        # Component stereotype icon (□ with small squares at top-right)
        icon_x, icon_y = x + w/2 - 0.18, y + h/2 - 0.19
        ax.add_patch(FancyBboxPatch((icon_x - 0.12, icon_y - 0.07), 0.24, 0.14,
                                    boxstyle="square,pad=0",
                                    linewidth=1, edgecolor="white", facecolor="none",
                                    zorder=6))
        ax.text(x - 0.05, y + h/2 - 0.19, name, ha="center", va="center",
                fontsize=9, fontweight="bold", color="white",
                fontfamily=FONT, zorder=5)
        row_h = min(0.28, (h - 0.38 - 0.1) / max(len(items), 1))
        iy = y + h/2 - 0.52
        for item in items:
            ax.text(x - w/2 + 0.18, iy, f"• {item}", ha="left", va="center",
                    fontsize=7.5, color="#1E293B", fontfamily=FONT, zorder=5)
            iy -= row_h

    # ── Layers ────────────────────────────────────────────────────────────────
    layer_rect(ax, 9.8, 2.5, "PRESENTATION LAYER", C_TEAL)
    layer_rect(ax, 7.1, 2.5, "API / SERVER LAYER",   C_BLUE)
    layer_rect(ax, 4.4, 2.5, "BUSINESS LOGIC LAYER", C_PURPLE)
    layer_rect(ax, 1.7, 2.3, "DATA ACCESS LAYER",    C_GREEN)

    # ── Presentation components ───────────────────────────────────────────────
    comp_box(ax, 2.5, 8.55, 3.4, 1.8, "HTML Pages",
             ["index.html – Home", "properties.html – Listing",
              "property.html – Detail", "contact.html – Contact"],
             C_TEAL, C_TEAL_LITE)
    comp_box(ax, 6.5, 8.55, 3.4, 1.8, "CSS Stylesheet",
             ["styles.css", "Responsive grid layout",
              "Property card styles", "Mobile-first breakpoints"],
             C_TEAL, C_TEAL_LITE)
    comp_box(ax, 10.5, 8.55, 3.0, 1.8, "JavaScript Engine",
             ["main.js", "fetchProperties(filters)",
              "renderPropertyCards()", "applyFilters()"],
             C_TEAL, C_TEAL_LITE)

    # ── API Layer components ──────────────────────────────────────────────────
    comp_box(ax, 2.5, 5.85, 3.4, 1.8, "Middleware Pipeline",
             ["CORS Handler", "JSON Body Parser",
              "Rate Limiter (100/15min)", "Static File Server"],
             C_BLUE, C_BLUE_LITE)
    comp_box(ax, 6.5, 5.85, 3.4, 1.8, "Express Router",
             ["GET /api/properties", "GET /api/properties/featured",
              "GET /api/properties/:id", "GET * (SPA fallback)"],
             C_BLUE, C_BLUE_LITE)
    comp_box(ax, 10.5, 5.85, 3.0, 1.8, "Request Handlers",
             ["validateQueryParams()", "parseFilterCriteria()",
              "formatAPIResponse()", "handleNotFound()"],
             C_BLUE, C_BLUE_LITE)

    # ── Business Logic components ─────────────────────────────────────────────
    comp_box(ax, 3.0, 3.15, 4.0, 1.8, "Filter Engine",
             ["applyStatusFilter()", "applyTypeFilter()",
              "applyCityFilter()", "applyPriceFilter()", "applyBedroomFilter()"],
             C_PURPLE, C_PURPLE_LT)
    comp_box(ax, 9.5, 3.15, 4.0, 1.8, "Validators",
             ["validateQueryParams()", "validatePropertyId()",
              "validatePriceRange()", "validateFilters()"],
             C_PURPLE, C_PURPLE_LT)

    # ── Data Access components ────────────────────────────────────────────────
    comp_box(ax, 3.5, 0.65, 5.0, 1.6, "PropertyRepository",
             ["loadProperties()", "getPropertyById(id)",
              "filterProperties(criteria)", "getFeaturedProperties()"],
             C_GREEN, C_GREEN_LT)
    comp_box(ax, 9.5, 0.65, 4.0, 1.6, "File I/O Manager",
             ["readJSON(path)", "parseJSON(text)",
              "data/properties.json (20 listings)"],
             C_GREEN, C_GREEN_LT)

    # ── Connector arrows between layers ───────────────────────────────────────
    for y_top, y_bot, c in [(7.1, 6.95, C_BLUE), (4.4, 4.25, C_PURPLE), (1.9, 1.75, C_GREEN)]:
        for xc in [2.5, 6.5, 10.5]:
            ax.annotate("", xy=(xc, y_bot),
                        xytext=(xc, y_top),
                        arrowprops=dict(arrowstyle="-|>", color=c, lw=1.5,
                                        shrinkA=4, shrinkB=4), zorder=2)

    save(fig, "component_diagram.png")


# ════════════════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("Generating diagrams …")
    make_er_diagram()
    make_use_case_diagram()
    make_dfd_level0()
    make_dfd_level1()
    make_class_diagram()
    make_architecture_diagram()
    make_component_diagram()
    print("All diagrams written to", OUTPUT_DIR)
