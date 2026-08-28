import { jsPDF } from "jspdf";
import { WeeklyMenuPlan } from "../types";

export function exportMenuToPDF(plan: WeeklyMenuPlan) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const checkAddPage = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 18;
      // mini header on subsequent pages
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text(`${plan.title} | AI Weekly Menu`, margin, y - 8);
      doc.setDrawColor(225, 230, 235);
      doc.line(margin, y - 5, pageWidth - margin, y - 5);
    }
  };

  // Header Banner
  doc.setFillColor(22, 101, 52); // Forest green
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("AI WEEKLY MENU - PLANIFICACIÓN SEMANAL", margin + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Personas: ${plan.inputConfig.servings} | Días: ${plan.days.length} | Supermercado: ${plan.inputConfig.supermarket || 'Habitual'} | Costo estimado: ${plan.costEstimate.totalEstimatedCost} ${plan.costEstimate.currency}`,
    margin + 6,
    y + 16
  );

  y += 28;

  // Title & Summary
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(plan.title, margin, y);
  y += 6;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(80, 90, 105);
  const summaryLines = doc.splitTextToSize(plan.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 4;

  // If Fit Mode
  if (plan.fitSummary) {
    checkAddPage(20);
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(21, 128, 61);
    doc.text("MODO FIT ACTIVO - OBJETIVOS NUTRICIONALES", margin + 4, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 50, 60);
    doc.text(
      `Calorías/día: ~${plan.days[0]?.totalCalories || 2000} kcal | Proteínas: ${plan.days[0]?.totalProtein || 140}g | Carbohidratos: ${plan.days[0]?.totalCarbs || 200}g | Grasas: ${plan.days[0]?.totalFat || 65}g`,
      margin + 4,
      y + 11
    );
    y += 20;
  }

  // Days and Meals
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("MENÚ DETALLADO DÍA A DÍA", margin, y);
  y += 7;

  plan.days.forEach((day) => {
    checkAddPage(30);

    // Day Header
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`DÍA ${day.dayNumber} - ${day.dayName.toUpperCase()}`, margin + 4, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `${day.totalCalories} kcal | P: ${day.totalProtein}g | C: ${day.totalCarbs}g | G: ${day.totalFat}g`,
      pageWidth - margin - 4,
      y + 5.5,
      { align: "right" }
    );
    y += 11;

    day.meals.forEach((meal) => {
      checkAddPage(22);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 64, 175);
      doc.text(`[${meal.mealType.toUpperCase()}] ${meal.name}`, margin + 2, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`${meal.prepTimeMinutes} min | ${meal.calories} kcal | ${meal.protein}g P | ${meal.carbs}g C | ${meal.fat}g G`, pageWidth - margin - 2, y, { align: "right" });
      y += 4.5;

      if (meal.ingredients && meal.ingredients.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(60, 70, 80);
        const ingText = `Ingredientes: ${meal.ingredients.join(", ")}`;
        const ingLines = doc.splitTextToSize(ingText, contentWidth - 4);
        doc.text(ingLines, margin + 4, y);
        y += ingLines.length * 3.6;
      }

      if (meal.instructions && meal.instructions.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(75, 85, 99);
        const stepText = `Pasos: ${meal.instructions.join(" ")}`;
        const stepLines = doc.splitTextToSize(stepText, contentWidth - 4);
        doc.text(stepLines, margin + 4, y);
        y += stepLines.length * 3.6;
      }

      y += 3;
    });

    y += 4;
  });

  // Shopping List Section
  checkAddPage(35);
  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("LISTA DE LA COMPRA CONSOLIDADA", margin, y);
  y += 7;

  plan.shoppingList.forEach((cat) => {
    checkAddPage(20);

    doc.setFillColor(236, 253, 245);
    doc.rect(margin, y, contentWidth, 6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70);
    doc.text(cat.name.toUpperCase(), margin + 3, y + 4.2);
    y += 8;

    cat.items.forEach((item) => {
      checkAddPage(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(40, 50, 60);

      // checkbox square
      doc.rect(margin + 2, y - 2.5, 2.8, 2.8);
      doc.text(`${item.name} (${item.quantity})`, margin + 7, y);

      if (item.estimatedPrice > 0) {
        doc.setTextColor(100, 116, 139);
        doc.text(`~${item.estimatedPrice.toFixed(2)} ${plan.costEstimate.currency}`, pageWidth - margin - 2, y, { align: "right" });
      }
      y += 4.5;
    });
    y += 2;
  });

  // Cost and Savings Section
  checkAddPage(30);
  y += 4;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14);
  doc.text(`ESTIMACIÓN DE COSTOS & CONSEJOS EN ${plan.inputConfig.supermarket?.toUpperCase() || 'EL SUPERMERCADO'}`, margin + 4, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60, 40, 10);
  doc.text(`Total estimado: ${plan.costEstimate.totalEstimatedCost} ${plan.costEstimate.currency} (${plan.costEstimate.costPerPerson} ${plan.costEstimate.currency}/persona)`, margin + 4, y + 10);
  
  if (plan.costEstimate.savingsAdvice) {
    const adviceLines = doc.splitTextToSize(plan.costEstimate.savingsAdvice, contentWidth - 8);
    doc.text(adviceLines, margin + 4, y + 15);
  }

  // Footer / Page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generado con AI Weekly Menu - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  // Save the PDF
  const filename = `Menu_Semanal_${plan.inputConfig.supermarket.replace(/\s+/g, "_")}_${plan.days.length}dias.pdf`;
  doc.save(filename);
}

export function copyShoppingListToClipboard(plan: WeeklyMenuPlan): boolean {
  try {
    let text = `🛒 LISTA DE LA COMPRA - AI WEEKLY MENU\n`;
    text += `📅 Plan: ${plan.days.length} días | 👥 ${plan.inputConfig.servings} personas\n`;
    text += `🏪 Supermercado: ${plan.inputConfig.supermarket || 'Habitual'}\n`;
    text += `💰 Estimación total: ${plan.costEstimate.totalEstimatedCost} ${plan.costEstimate.currency}\n\n`;

    plan.shoppingList.forEach((cat) => {
      text += `📍 ${cat.name.toUpperCase()}:\n`;
      cat.items.forEach((item) => {
        const check = item.checked ? '✅' : '▫️';
        text += `${check} ${item.name} - ${item.quantity} (~${item.estimatedPrice.toFixed(2)} ${plan.costEstimate.currency})\n`;
      });
      text += `\n`;
    });

    if (plan.costEstimate.savingsAdvice) {
      text += `💡 Consejo de Ahorro: ${plan.costEstimate.savingsAdvice}\n`;
    }

    navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Error copying to clipboard", err);
    return false;
  }
}
