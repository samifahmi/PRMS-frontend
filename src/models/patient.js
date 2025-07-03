// filepath: /home/jared/Documents/Sami/prms-frontend/src/models/patient.js
class Patient {
  constructor(id, name, age, gender, medicalHistory, contactInfo) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.medicalHistory = medicalHistory;
    this.contactInfo = contactInfo;
  }

  validate() {
    if (!this.name || typeof this.name !== 'string') {
      throw new Error('Invalid name');
    }
    if (!this.age || typeof this.age !== 'number' || this.age < 0) {
      throw new Error('Invalid age');
    }
    if (!this.gender || (this.gender !== 'male' && this.gender !== 'female' && this.gender !== 'other')) {
      throw new Error('Invalid gender');
    }
    if (!Array.isArray(this.medicalHistory)) {
      throw new Error('Medical history must be an array');
    }
    if (!this.contactInfo || typeof this.contactInfo !== 'object') {
      throw new Error('Invalid contact information');
    }
  }
}

export default Patient;