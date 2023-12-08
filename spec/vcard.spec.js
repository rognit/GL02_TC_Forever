import inquirer from 'inquirer';
import fs from 'fs';
import { createVCardFromUserInput , saveVCardFromUserInput } from '../src/Vcard/vcard.js';
import { create_vcard_menu } from '../src/menus.js';

describe('VCard functions', () => {
  describe('createVCardFromUserInput', () => {
    it('should create a valid VCard string', () => {
      const userInput = {
        prenom: 'Louise',
        nom: 'Martin',
        nomEtablissement: 'utt',
        poste: 'Student',
        numeroTel: '+33 6 23 45 67 89',
        numeroRue: '123',
        nomRue: 'rue Grande',
        bp: '10000',
        ville: 'Troyes',
        siteWeb: 'www.utt.fr',
      };

      const vCardString = createVCardFromUserInput(userInput);

      expect(vCardString).toContain('BEGIN:VCARD');
      expect(vCardString).toContain('FN:Louise Martin');
      expect(vCardString).toContain('ORG:utt');
      expect(vCardString).toContain('TITLE:Student');
      expect(vCardString).toContain('ADR;TYPE=WORK:;;123 rue Grande;10000;Troyes;;');
      expect(vCardString).toContain('TEL:+33 6 23 45 67 89');
      expect(vCardString).toContain('EMAIL:louise@utt.fr');
      expect(vCardString).toContain('URL:www.utt.fr');
      expect(vCardString).toContain('END:VCARD');
    });

    it('should handle incomplete user input', () => {
      const incompleteInput = {
        prenom: 'Louise',
        // Missing other required fields
      };

      const vCardString = createVCardFromUserInput(incompleteInput);

      expect(vCardString).toBeUndefined();
    });
  });

  describe('saveVCardFromUserInput', () => {
    it('should save the VCard file successfully', () => {
      const userInput = {
        prenom: 'Louise',
        nom: 'Martin',
        nomEtablissement: 'utt',
        poste: 'Student',
        numeroTel: '+33 6 23 45 67 89',
        numeroRue: '123',
        nomRue: 'rue Grande',
        bp: '10000',
        ville: 'Troyes',
        siteWeb: 'www.utt.fr',
      };

      const spyConsoleLog = spyOn(console, 'log'); // Spy on console.log to check the success message
      const spyWriteFile = spyOn(fs, 'writeFile'); // Spy on fs.writeFile to check if it's called

      saveVCardFromUserInput(userInput);

      // Expectations
      expect(spyWriteFile).toHaveBeenCalled();
      expect(spyConsoleLog).toHaveBeenCalledWith(`Fichier VCard créé avec succès : ./src/Vcard/data_vcard/Louise_Martin.vcf`);
    });

    it('should handle incomplete user input and not save the VCard file', () => {
      const incompleteInput = {
        prenom: 'Louise',
        // Missing other required fields
      };

      const spyWriteFile = spyOn(fs, 'writeFile'); // Spy on fs.writeFile to check if it's called

      saveVCardFromUserInput(incompleteInput);

      // Expectations
      expect(spyWriteFile).not.toHaveBeenCalled();
    });
  });
});
