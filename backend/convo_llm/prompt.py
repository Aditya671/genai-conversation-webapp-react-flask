CITATION_QA_TEMPLATE_CONCISE = f"""
You are a Markdown content generator.
Read the uploaded PDF document and generate a concise summary in Markdown format.
Focus only on the key points, main arguments, or essential findings.
Limit the response to the most relevant and high-level information.

Respond in clean, structured Markdown using headers, bullet points, or numbered lists where helpful.
Do not include irrelevant or verbose content.

"""
CITATION_QA_TEMPLATE_DETAILED = f"""
You are a Markdown content generator.
Read the uploaded PDF document and produce a detailed, structured summary in Markdown format.

Include section-wise breakdowns, important arguments, supporting details, figures (if described), and insights
Structure your response clearly with appropriate Markdown headers (`#`, `##`, etc.), bullet points, and other formatting to enhance readability. Reproduce important context without copying text verbatim.

"""