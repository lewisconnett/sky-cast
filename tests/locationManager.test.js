// locationManager.test.js

const { addWeatherLocation, removeWeatherLocation } = require('../src/pages/MainScreen.js');

describe('Weather Location Management', () => {
  
  test('addWeatherLocation adds a new location', () => {
    const locations = ['London', 'New York', 'Tokyo'];
    const newLocation = 'Madrid';
    const updatedLocations = addWeatherLocation(locations, newLocation);
    
    expect(updatedLocations).toContain(newLocation);
    expect(updatedLocations.length).toBe(4);
  });

  test('removeWeatherLocation removes an existing location', () => {
    const locations = ['London', 'New York', 'Tokyo', 'Madrid'];
    const locationToDelete = 'Tokyo';
    const updatedLocations = removeWeatherLocation(locations, locationToDelete);
    
    expect(updatedLocations).not.toContain(locationToDelete);
    expect(updatedLocations.length).toBe(3);
  });

  test('removeWeatherLocation does not remove a non-existent location', () => {
    const locations = ['London', 'New York', 'Tokyo', 'Madrid'];
    const locationToDelete = 'Paris';
    const updatedLocations = removeWeatherLocation(locations, locationToDelete);
    
    expect(updatedLocations).toEqual(locations);
    expect(updatedLocations.length).toBe(4);
  });

  test('addWeatherLocation does not add a duplicate location', () => {
    const locations = ['London', 'New York', 'Tokyo'];
    const newLocation = 'Tokyo';
    const updatedLocations = addWeatherLocation(locations, newLocation);
    
    expect(updatedLocations.filter(location => location === newLocation).length).toBe(1);
    expect(updatedLocations.length).toBe(3);
  });
});


