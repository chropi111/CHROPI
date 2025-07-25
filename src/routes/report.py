from flask import Blueprint, jsonify, request, send_file
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch
from src.models.material import Material
import io
import os
from datetime import datetime

report_bp = Blueprint('report', __name__)

@report_bp.route('/report/pdf', methods=['GET'])
def generate_pdf_report():
    try:
        # Criar buffer em memória para o PDF
        buffer = io.BytesIO()
        
        # Configurar documento PDF
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        
        # Estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            alignment=1  # Centralizado
        )
        
        # Título
        title = Paragraph("PLANILHA DE CONTROLE DE ESTOQUE DE PINCÉIS", title_style)
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        # Data de geração
        date_style = ParagraphStyle(
            'DateStyle',
            parent=styles['Normal'],
            fontSize=10,
            alignment=2  # Direita
        )
        date_text = f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M')}"
        date_para = Paragraph(date_text, date_style)
        elements.append(date_para)
        elements.append(Spacer(1, 20))
        
        # Cabeçalhos da tabela
        headers = ['Item', 'Descrição', 'Apresentação', 'Estoque', 'Pedido']
        
        # Buscar materiais do banco de dados
        materials = Material.query.all()
        
        # Dados da tabela
        data = [headers]
        
        # Adicionar dados dos materiais (limitado a 15 itens conforme solicitado)
        for i in range(15):
            if i < len(materials):
                material = materials[i]
                row = [
                    str(i + 1),
                    material.name,
                    material.presentation,
                    str(material.stock_quantity),
                    ''  # Coluna "Pedido" sempre em branco
                ]
            else:
                # Preencher linhas vazias até completar 15
                row = [str(i + 1), '', '', '', '']
            data.append(row)
        
        # Criar tabela
        table = Table(data, colWidths=[0.8*inch, 3*inch, 1.2*inch, 1*inch, 1*inch])
        
        # Estilo da tabela
        table.setStyle(TableStyle([
            # Cabeçalho
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            
            # Corpo da tabela
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            
            # Bordas
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            
            # Alternating row colors
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ]))
        
        elements.append(table)
        
        # Adicionar observações
        elements.append(Spacer(1, 30))
        obs_style = ParagraphStyle(
            'ObsStyle',
            parent=styles['Normal'],
            fontSize=9,
            leftIndent=20
        )
        
        observations = [
            "OBSERVAÇÕES:",
            "• A coluna 'Pedido' deve ser preenchida manualmente conforme necessidade",
            "• Este relatório reflete o estoque atual no momento da geração",
            "• Para atualizações, acesse o sistema de controle de estoque"
        ]
        
        for obs in observations:
            if obs.startswith("OBSERVAÇÕES"):
                obs_para = Paragraph(f"<b>{obs}</b>", obs_style)
            else:
                obs_para = Paragraph(obs, obs_style)
            elements.append(obs_para)
            elements.append(Spacer(1, 5))
        
        # Construir PDF
        doc.build(elements)
        
        # Preparar resposta
        buffer.seek(0)
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=f'estoque_pinceis_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': f'Erro ao gerar PDF: {str(e)}'}), 500

@report_bp.route('/report/excel', methods=['GET'])
def generate_excel_report():
    """Rota alternativa para gerar relatório em Excel (futuro)"""
    return jsonify({'message': 'Funcionalidade Excel em desenvolvimento'}), 501

