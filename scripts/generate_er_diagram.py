import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import textwrap
import os

def generate_diagram(is_dark=True, filename_suffix=""):
    # Ultra-high-res 21x13 inches at 300 DPI (6300 x 3900 px)
    fig, ax = plt.subplots(figsize=(21, 13), dpi=300)
    
    if is_dark:
        bg_color = "#090d16"
        card_bg = "#131b2a"
        card_border = "#202d42"
        text_primary = "#ffffff"
        text_secondary = "#94a3b8"
        text_muted = "#64748b"
        line_color = "#1e293b"
        card_shadow = "#020617"
        row_line = "#1a2436"
        p_hdr_bg = "#1e293b"
        p_card_bg = "#131b2a"
        p_card_border = "#334155"
        leg_bg_color = "#131b2a"
        leg_border = "#1e293b"
        rel_bg = "#090d16"
    else:
        bg_color = "#f8fafc"
        card_bg = "#ffffff"
        card_border = "#e2e8f0"
        text_primary = "#0f172a"
        text_secondary = "#475569"
        text_muted = "#64748b"
        line_color = "#cbd5e1"
        card_shadow = "#94a3b8"
        row_line = "#f1f5f9"
        p_hdr_bg = "#f1f5f9"
        p_card_bg = "#ffffff"
        p_card_border = "#cbd5e1"
        leg_bg_color = "#ffffff"
        leg_border = "#cbd5e1"
        rel_bg = "#ffffff"

    fig.patch.set_facecolor(bg_color)
    ax.set_facecolor(bg_color)
    ax.set_xlim(0, 2100)
    ax.set_ylim(0, 1300)
    ax.axis("off")

    # Header Title
    ax.text(1050, 1245, "PrimeWave Lab  •  Resource Reservation Management System", 
            fontsize=24, fontweight="bold", color=text_primary, ha="center", fontfamily="sans-serif")
    ax.text(1050, 1210, "Entity-Relationship (ER) Architecture Diagram  |  PostgreSQL 16 & Prisma ORM  |  ACID Data Model", 
            fontsize=13, color=text_secondary, ha="center", fontfamily="sans-serif")
    ax.plot([80, 2020], [1180, 1180], color=line_color, linewidth=1.5)

    def render_table(ax, x, top_y, width, title, header_color, fields):
        header_h = 44
        row_h = 24.5
        total_h = header_h + len(fields) * row_h + 14
        bottom_y = top_y - total_h
        
        # Drop Shadow
        shadow = patches.FancyBboxPatch((x + 3, bottom_y - 3), width, total_h,
                                        boxstyle="round,pad=2,rounding_size=10",
                                        facecolor=card_shadow, edgecolor="none", alpha=0.35 if is_dark else 0.15, zorder=1)
        ax.add_patch(shadow)
        
        # Table Card Body
        card = patches.FancyBboxPatch((x, bottom_y), width, total_h,
                                      boxstyle="round,pad=2,rounding_size=10",
                                      facecolor=card_bg, edgecolor=card_border, linewidth=1.4, zorder=2)
        ax.add_patch(card)
        
        # Table Header
        header_box = patches.FancyBboxPatch((x, top_y - header_h), width, header_h,
                                            boxstyle="round,pad=2,rounding_size=10",
                                            facecolor=header_color, edgecolor="none", zorder=3)
        ax.add_patch(header_box)
        header_fill = patches.Rectangle((x, top_y - header_h), width, 12,
                                        facecolor=header_color, edgecolor="none", zorder=3)
        ax.add_patch(header_fill)
        
        # Title text
        ax.text(x + 18, top_y - 25, title, fontsize=13, fontweight="bold", color="#ffffff", va="center", zorder=4)
        
        # Fields List
        curr_y = top_y - header_h - 15
        for key_type, name, data_type in fields:
            if key_type == "PK":
                kbox = patches.FancyBboxPatch((x + 16, curr_y - 8), 24, 15, boxstyle="round,pad=0.5,rounding_size=3",
                                              facecolor="#0284c7", edgecolor="none", zorder=4)
                ax.add_patch(kbox)
                ax.text(x + 28, curr_y - 0.5, "PK", fontsize=7.5, fontweight="bold", color="#ffffff", ha="center", va="center", zorder=5)
            elif key_type == "FK":
                kbox = patches.FancyBboxPatch((x + 16, curr_y - 8), 24, 15, boxstyle="round,pad=0.5,rounding_size=3",
                                              facecolor="#ec4899", edgecolor="none", zorder=4)
                ax.add_patch(kbox)
                ax.text(x + 28, curr_y - 0.5, "FK", fontsize=7.5, fontweight="bold", color="#ffffff", ha="center", va="center", zorder=5)
            elif key_type == "UQ":
                kbox = patches.FancyBboxPatch((x + 16, curr_y - 8), 24, 15, boxstyle="round,pad=0.5,rounding_size=3",
                                              facecolor="#eab308", edgecolor="none", zorder=4)
                ax.add_patch(kbox)
                ax.text(x + 28, curr_y - 0.5, "UQ", fontsize=7.5, fontweight="bold", color="#000000", ha="center", va="center", zorder=5)
            else:
                ax.text(x + 28, curr_y, "•", fontsize=9, color="#94a3b8" if is_dark else "#cbd5e1", ha="center", va="center", zorder=4)
                
            fweight = "bold" if key_type in ["PK", "FK"] else "normal"
            fcolor = text_primary if key_type in ["PK", "FK"] else (text_primary if not is_dark else "#cbd5e1")
            ax.text(x + 50, curr_y, name, fontsize=9.5, fontweight=fweight, color=fcolor, va="center", zorder=4)
            ax.text(x + width - 16, curr_y, data_type, fontsize=8.5, color=text_muted, va="center", ha="right", fontfamily="monospace", zorder=4)
            ax.plot([x + 12, x + width - 12], [curr_y - 10, curr_y - 10], color=row_line, linewidth=0.6, zorder=3)
            curr_y -= row_h
            
        return {"x": x, "y": bottom_y, "w": width, "h": total_h, "top": top_y}

    # 1. resource_categories
    cat_fields = [
        ("PK", "id", "String (cuid)"),
        ("UQ", "name", "String (255)"),
        ("UQ", "slug", "String (255)"),
        ("", "description", "Text"),
        ("", "icon", "String (50)"),
        ("", "createdAt", "DateTime"),
    ]
    t_cat = render_table(ax, 70, 1140, 360, "resource_categories", "#0f766e", cat_fields)

    # 2. resources
    res_fields = [
        ("PK", "id", "String (cuid)"),
        ("UQ", "code", "String (50)"),
        ("", "name", "String (255)"),
        ("FK", "categoryId", "String (cuid)"),
        ("", "location", "String (255)"),
        ("", "capacity", "Int"),
        ("", "amenities", "String (JSON)"),
        ("", "status", "ResourceStatus"),
        ("", "imageUrl", "String (500)"),
        ("", "minBookingMinutes", "Int"),
        ("", "maxBookingMinutes", "Int"),
        ("", "requiresApproval", "Boolean"),
        ("", "description", "Text"),
        ("", "createdAt", "DateTime"),
        ("", "updatedAt", "DateTime"),
    ]
    t_res = render_table(ax, 550, 1140, 420, "resources", "#0369a1", res_fields)

    # 3. reservations
    resv_fields = [
        ("PK", "id", "String (cuid)"),
        ("FK", "resourceId", "String (cuid)"),
        ("FK", "userId", "String (cuid)"),
        ("", "title", "String (255)"),
        ("", "startTime", "DateTime (idx)"),
        ("", "endTime", "DateTime (idx)"),
        ("", "status", "ReservationStatus"),
        ("", "attendeesCount", "Int"),
        ("", "checkInTime", "DateTime"),
        ("", "notes", "Text"),
        ("", "cancellationReason", "String (500)"),
        ("", "createdAt", "DateTime"),
        ("", "updatedAt", "DateTime"),
    ]
    t_resv = render_table(ax, 1070, 1140, 420, "reservations", "#6d28d9", resv_fields)

    # 4. maintenance_logs
    maint_fields = [
        ("PK", "id", "String (cuid)"),
        ("FK", "resourceId", "String (cuid)"),
        ("FK", "userId", "String (cuid)"),
        ("", "action", "String (100)"),
        ("", "details", "Text"),
        ("", "performedBy", "String (255)"),
        ("", "createdAt", "DateTime"),
    ]
    t_maint = render_table(ax, 550, 560, 420, "maintenance_logs", "#b45309", maint_fields)

    # 5. users
    user_fields = [
        ("PK", "id", "String (cuid)"),
        ("", "name", "String (255)"),
        ("UQ", "email", "String (255)"),
        ("", "department", "String (100)"),
        ("", "role", "Role (Enum)"),
        ("", "avatarUrl", "String (500)"),
        ("", "createdAt", "DateTime"),
        ("", "updatedAt", "DateTime"),
    ]
    t_user = render_table(ax, 1070, 560, 420, "users", "#1d4ed8", user_fields)

    # Relationships
    def draw_badge_arrow(ax, p1, p2, color, badge_text):
        ax.annotate("", xy=p2, xytext=p1,
                    arrowprops=dict(arrowstyle="-|>,head_width=0.45,head_length=0.65", color=color, lw=2.2))
        mx = (p1[0] + p2[0]) / 2
        my = (p1[1] + p2[1]) / 2
        box = patches.FancyBboxPatch((mx - 24, my - 11), 48, 22, boxstyle="round,pad=1,rounding_size=5",
                                    fc=rel_bg, ec=color, lw=1.3, zorder=6)
        ax.add_patch(box)
        ax.text(mx, my, badge_text, fontsize=8, fontweight="bold", color=color, ha="center", va="center", zorder=7)

    draw_badge_arrow(ax, (430, 1050), (550, 1050), "#0d9488" if not is_dark else "#14b8a6", "1 : N")
    draw_badge_arrow(ax, (970, 1050), (1070, 1050), "#0284c7" if not is_dark else "#38bdf8", "1 : N")
    draw_badge_arrow(ax, (760, 680), (760, 560), "#d97706" if not is_dark else "#fbbf24", "1 : N")
    draw_badge_arrow(ax, (1280, 560), (1280, 680), "#7c3aed" if not is_dark else "#a855f7", "1 : N")
    draw_badge_arrow(ax, (1070, 420), (970, 420), "#db2777" if not is_dark else "#ec4899", "1 : N")

    # Architecture Highlights Card (Far Right)
    box_x = 1570
    box_y = 280
    box_w = 460
    box_h = 860

    p_shadow = patches.FancyBboxPatch((box_x + 3, box_y - 3), box_w, box_h,
                                      boxstyle="round,pad=2,rounding_size=10",
                                      facecolor=card_shadow, edgecolor="none", alpha=0.35 if is_dark else 0.15, zorder=1)
    ax.add_patch(p_shadow)

    p_box = patches.FancyBboxPatch((box_x, box_y), box_w, box_h,
                                   boxstyle="round,pad=2,rounding_size=10",
                                   facecolor=p_card_bg, edgecolor=p_card_border, linewidth=1.5, zorder=2)
    ax.add_patch(p_box)

    p_hdr = patches.FancyBboxPatch((box_x, box_y + box_h - 44), box_w, 44,
                                   boxstyle="round,pad=2,rounding_size=10",
                                   facecolor=p_hdr_bg, edgecolor="none", zorder=3)
    ax.add_patch(p_hdr)
    p_fill = patches.Rectangle((box_x, box_y + box_h - 44), box_w, 12, facecolor=p_hdr_bg, edgecolor="none", zorder=3)
    ax.add_patch(p_fill)

    ax.text(box_x + 20, box_y + box_h - 24, "⚡ Engine Architecture & Policies", fontsize=13, fontweight="bold", 
            color="#0284c7" if not is_dark else "#38bdf8", zorder=4)

    arch_points = [
        {
            "num": "1",
            "title": "Atomic Collision Prevention",
            "desc": "Eliminates double-booking at application and database layers with serializable transaction locks. Enforces standard overlap interval formula: (StartA < EndB) AND (EndA > StartB)."
        },
        {
            "num": "2",
            "title": "Composite Overlap Indexes",
            "desc": "B-Tree index @@index([resourceId, startTime, endTime]) guarantees O(log N) lookup latency (<5ms) during real-time schedule conflict verification."
        },
        {
            "num": "3",
            "title": "In-Person Check-In Verification",
            "desc": "Resolves real-world meeting room abandonment (ghost bookings). Bookings advance to CHECKED_IN upon arrival or release immediately upon user cancellation."
        },
        {
            "num": "4",
            "title": "Facility Maintenance Shutdown",
            "desc": "Facilities in MAINTENANCE status immediately reject new reservations across the entire system. Technicians log diagnostics in maintenance_logs."
        },
        {
            "num": "5",
            "title": "Referential Cascade Integrity",
            "desc": "Foreign key relationships enforce cascade deletions and foreign constraints across users, facilities, and reservation records."
        }
    ]

    cur_pt_y = box_y + box_h - 75
    for pt in arch_points:
        # Title with number bullet
        ax.text(box_x + 22, cur_pt_y, f"{pt['num']}.  {pt['title']}", fontsize=10.5, fontweight="bold", color=text_primary, va="center", zorder=4)
        cur_pt_y -= 20
        
        # Description lines
        wrapped_lines = textwrap.wrap(pt["desc"], width=52)
        for line in wrapped_lines:
            ax.text(box_x + 36, cur_pt_y, line, fontsize=8.5, color=text_secondary, va="center", zorder=4)
            cur_pt_y -= 14
            
        cur_pt_y -= 18

    # Bottom Legend & Conventions Bar (Cleanly spaced)
    leg_bg = patches.FancyBboxPatch((70, 50), 1960, 58, boxstyle="round,pad=2,rounding_size=8",
                                   facecolor=leg_bg_color, edgecolor=leg_border, linewidth=1.2, zorder=2)
    ax.add_patch(leg_bg)

    ax.text(95, 79, "SCHEMA CONVENTIONS:", fontsize=9.5, fontweight="bold", color=text_primary, va="center", zorder=3)

    legends = [
        ("PK", "#0284c7", "Primary Key (cuid)"),
        ("FK", "#ec4899", "Foreign Key Reference"),
        ("UQ", "#eab308", "Unique Key Constraint"),
        ("1 : N", "#14b8a6", "One-to-Many Relation"),
        ("idx", "#a855f7", "B-Tree Indexed Field"),
        ("Cascade", "#64748b", "onDelete: Cascade Integrity")
    ]

    lx = 330
    for tag, color, text in legends:
        pw = 56 if len(tag) > 3 else 38
        t_pill = patches.FancyBboxPatch((lx, 69), pw, 20, boxstyle="round,pad=1,rounding_size=4", fc=color, ec="none", zorder=3)
        ax.add_patch(t_pill)
        ax.text(lx + pw / 2, 79, tag, fontsize=7.2, fontweight="bold", color="#ffffff", ha="center", va="center", zorder=4)
        ax.text(lx + pw + 10, 79, text, fontsize=8.5, color=text_secondary, va="center", zorder=3)
        lx += 265

    out_file = f"er_diagram{filename_suffix}.png"
    out_paths = [
        os.path.join("C:/Users/thuru/.gemini/antigravity/scratch/resource-reservation-system", out_file),
        os.path.join("C:/Users/thuru/.gemini/antigravity/scratch/resource-reservation-system/public", out_file),
        os.path.join("C:/Users/thuru/.gemini/antigravity/brain/1e256d07-a856-484c-943d-c6c6dc018937", out_file)
    ]
    for p in out_paths:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        plt.savefig(p, dpi=300, bbox_inches="tight", facecolor=fig.get_facecolor(), edgecolor="none")
        print(f"Generated {out_file} at: {p}")
        
    plt.close()

generate_diagram(is_dark=True, filename_suffix="")
generate_diagram(is_dark=False, filename_suffix="_light")
print("Both PNG diagrams regenerated cleanly!")