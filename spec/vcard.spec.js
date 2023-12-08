// vcard.spec.js
import fs from 'fs';
import inquirer from 'inquirer';
import { createVCardFromUserInput, saveVCardFromUserInput } from '../src/Vcard/vcard.js';

describe('VCard Functions', () => {
    it('createVCardFromUserInput should create a valid vCard string', () => {
      const userInput = {
        prenom: 'John',
        nom: 'Doe',
        nomEtablissement: 'Example School',
        poste: 'Teacher',
        numeroTel: '+33 1 23 45 67 89',
        numeroRue: '123',
        nomRue: 'Main Street',
        bp: '456',
        ville: 'City',
        siteWeb: 'www.exampleschool.fr',
      };
  
      const vCardString = createVCardFromUserInput(userInput);
  
      // Assertions
      expect(vCardString).toContain('BEGIN:VCARD');
      expect(vCardString).toContain('VERSION:3.0');
      expect(vCardString).toContain(`FN:${userInput.prenom} ${userInput.nom}`);
      expect(vCardString).toContain(`ORG:${userInput.nomEtablissement}`);
      expect(vCardString).toContain(`TITLE:${userInput.poste}`);
      expect(vCardString).toContain(`ADR;TYPE=WORK:;;${userInput.numeroRue} ${userInput.nomRue};${userInput.bp};${userInput.ville};;`);
      expect(vCardString).toContain(`TEL:${userInput.numeroTel}`);
      expect(vCardString).toContain(`EMAIL:${userInput.prenom.toLowerCase()}@${userInput.nomEtablissement.toLowerCase()}.fr`);
      expect(vCardString).toContain(`URL:${userInput.siteWeb}`);
      expect(vCardString).toContain('END:VCARD');
    });
  
    it('saveVCardFromUserInput should create a vCard file successfully', () => {
      // Mocking fs functions
      spyOn(fs, 'existsSync').and.returnValue(false);
      spyOn(fs, 'mkdirSync');
      spyOn(fs, 'writeFile').and.callFake((fileName, data, callback) => callback(null));
  
      const userInput = {
        prenom: 'John',
        nom: 'Doe',
        nomEtablissement: 'Example School',
        poste: 'Teacher',
        numeroTel: '+33 1 23 45 67 89',
        numeroRue: '123',
        nomRue: 'Main Street',
        bp: '456',
        ville: 'City',
        siteWeb: 'www.exampleschool.fr',
      };
  
      saveVCardFromUserInput(userInput);
  
      // Assertions
      expect(fs.existsSync).toHaveBeenCalledWith('./src/Vcard/data_vcard');
      expect(fs.mkdirSync).toHaveBeenCalledWith('./src/Vcard/data_vcard');
      const expectedFileName = `./src/Vcard/data_vcard/${userInput.prenom}_${userInput.nom}.vcf`;
      expect(fs.writeFile).toHaveBeenCalledWith(expectedFileName, jasmine.any(String), jasmine.any(Function));
    });
  });