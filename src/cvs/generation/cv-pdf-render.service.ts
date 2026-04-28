import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import {
  CreateCvEducationEntryDto,
  CreateCvPersonalDetailsDto,
  CreateCvWorkExperienceDto,
} from '../dto/create-cv.dto';

interface RenderCvPdfInput {
  title: string | null;
  targetRole: string;
  personalDetails: CreateCvPersonalDetailsDto;
  summaryText: string;
  workExperiences: CreateCvWorkExperienceDto[];
  educationEntries: CreateCvEducationEntryDto[];
  skills: string[];
}

@Injectable()
export class CvPdfRenderService {
  constructor(private readonly configService: ConfigService) {}

  async renderCvPdf(input: RenderCvPdfInput) {
    const executablePath = this.configService
      .get<string>('PUPPETEER_EXECUTABLE_PATH')
      ?.trim();

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(this.buildHtml(input), {
        waitUntil: 'networkidle0',
      });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '16mm',
          right: '14mm',
          bottom: '16mm',
          left: '14mm',
        },
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private buildHtml(input: RenderCvPdfInput) {
    const contactItems = [
      input.personalDetails.email,
      input.personalDetails.phone,
      input.personalDetails.location,
    ]
      .filter(Boolean)
      .map((item) => this.escapeHtml(item as string));

    const workExperienceHtml = input.workExperiences.length
      ? input.workExperiences
          .map(
            (workExperience) => `
              <article class="entry">
                <div class="entry-header">
                  <div>
                    <h3>${this.escapeHtml(workExperience.jobTitle)}</h3>
                    <p>${this.escapeHtml(workExperience.companyName)}</p>
                  </div>
                  <span>${this.escapeHtml(workExperience.periodLabel)}</span>
                </div>
                ${
                  workExperience.description?.trim()
                    ? `<p class="entry-body">${this.escapeHtml(workExperience.description)}</p>`
                    : ''
                }
              </article>
            `,
          )
          .join('')
      : '<p class="muted">Sin experiencia registrada.</p>';

    const educationHtml = input.educationEntries.length
      ? input.educationEntries
          .map(
            (educationEntry) => `
              <article class="entry compact">
                <div class="entry-header">
                  <div>
                    <h3>${this.escapeHtml(educationEntry.degreeTitle)}</h3>
                    <p>${this.escapeHtml(educationEntry.institutionName)}</p>
                  </div>
                  <span>${this.escapeHtml(educationEntry.periodLabel)}</span>
                </div>
              </article>
            `,
          )
          .join('')
      : '<p class="muted">Sin formación registrada.</p>';

    const skillsHtml = input.skills.length
      ? input.skills
          .map(
            (skill) => `<li>${this.escapeHtml(skill)}</li>`,
          )
          .join('')
      : '<li>Sin habilidades registradas.</li>';

    const safeTitle = input.title?.trim()
      ? this.escapeHtml(input.title)
      : `CV ${this.escapeHtml(input.targetRole)}`;

    return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              font-family: Arial, Helvetica, sans-serif;
              color: #111827;
              background: #ffffff;
            }
            .page {
              padding: 0;
            }
            .header {
              border-bottom: 2px solid #111827;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              line-height: 1.1;
            }
            .header .role {
              margin: 6px 0 10px;
              font-size: 14px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #374151;
            }
            .header .contact {
              margin: 0;
              font-size: 12px;
              color: #4b5563;
            }
            .section {
              margin-bottom: 20px;
            }
            .section h2 {
              margin: 0 0 10px;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: #374151;
            }
            .section p {
              margin: 0;
              font-size: 12px;
              line-height: 1.6;
            }
            .entry {
              margin-bottom: 12px;
            }
            .entry-header {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              align-items: baseline;
            }
            .entry-header h3 {
              margin: 0;
              font-size: 13px;
            }
            .entry-header p {
              margin: 2px 0 0;
              font-size: 12px;
              color: #4b5563;
            }
            .entry-header span {
              font-size: 11px;
              color: #6b7280;
              white-space: nowrap;
            }
            .entry-body {
              margin-top: 6px;
            }
            .skills {
              list-style: none;
              padding: 0;
              margin: 0;
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
            }
            .skills li {
              border: 1px solid #d1d5db;
              border-radius: 999px;
              padding: 4px 8px;
              font-size: 11px;
            }
            .muted {
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <main class="page">
            <header class="header">
              <h1>${this.escapeHtml(input.personalDetails.fullName)}</h1>
              <p class="role">${this.escapeHtml(input.targetRole)}</p>
              <p class="contact">${contactItems.join(' · ')}</p>
            </header>

            <section class="section">
              <h2>Perfil</h2>
              <p>${this.escapeHtml(input.summaryText)}</p>
            </section>

            <section class="section">
              <h2>Experiencia</h2>
              ${workExperienceHtml}
            </section>

            <section class="section">
              <h2>Educación</h2>
              ${educationHtml}
            </section>

            <section class="section">
              <h2>Habilidades</h2>
              <ul class="skills">${skillsHtml}</ul>
            </section>

            <footer class="section">
              <p class="muted">${safeTitle}</p>
            </footer>
          </main>
        </body>
      </html>
    `;
  }

  private escapeHtml(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}