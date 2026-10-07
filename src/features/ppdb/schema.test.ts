import { describe, expect, it } from 'vitest';
import { PPDB_DEFAULTS, isPlausibleBirthdate, ppdbSchema, toRegistrationPayload } from './schema';

const valid = { ...PPDB_DEFAULTS, studentName: 'Budi Santoso', parentName: 'Siti Aminah', whatsapp: '0812-3456-7890' };

describe('ppdbSchema', () => {
  it('menerima data minimal', () => {
    expect(ppdbSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['studentName', ''],
    ['parentName', 'A'],
    ['whatsapp', '12345'],
    ['email', 'bukan-email'],
    ['nisn', '123'],
    ['birthdate', '1990-01-01'],
  ])('menolak %s yang tidak valid', (field, value) => {
    expect(ppdbSchema.safeParse({ ...valid, [field]: value }).success).toBe(false);
  });

  it('memeriksa kewajaran tanggal lahir', () => {
    const today = new Date('2026-10-01');
    expect(isPlausibleBirthdate('2013-05-10', today)).toBe(true);
    expect(isPlausibleBirthdate('2024-05-10', today)).toBe(false);
    expect(isPlausibleBirthdate('bukan-tanggal', today)).toBe(false);
  });
});

describe('toRegistrationPayload', () => {
  it('mengubah isian kosong menjadi null dan merapikan nomor', () => {
    const payload = toRegistrationPayload({ ...valid, boarding: 'ya' });
    expect(payload).toMatchObject({
      source: 'ppdb_form',
      whatsapp: '081234567890',
      student_gender: null,
      student_birthdate: null,
      boarding_interest: true,
    });
    expect(toRegistrationPayload({ ...valid, boarding: 'tidak' }).boarding_interest).toBe(false);
    expect(toRegistrationPayload(valid).boarding_interest).toBeNull();
  });
});
