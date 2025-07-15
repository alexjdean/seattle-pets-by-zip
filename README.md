# Seattle Pet Licenses Map

A React web application that visualizes Seattle pet license data on an interactive map. The application shows pet license distribution across different ZIP codes in Seattle, with the ability to filter by species.

## Features

- **Interactive Map**: Displays Seattle with circles representing pet license counts by ZIP code
- **Circle Visualization**: Circle sizes represent the number of pet licenses (larger circles = more licenses)
- **Species Filtering**: Filter data by species (Dogs, Cats, Goats, Pigs, or All)
- **Color Coding**: Different colors for different species
- **Detailed Popups**: Click on circles to see detailed information including:
  - Total licenses in that ZIP code
  - Breakdown by species with percentages
  - Most popular pet names in that area
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React**: Frontend framework
- **Leaflet**: Interactive mapping library
- **React-Leaflet**: React components for Leaflet
- **PapaParse**: CSV parsing library
- **OpenStreetMap**: Map tiles

## Data Source

The application uses Seattle pet license data from the Seattle Open Data portal. The dataset includes:
- License issue dates
- Pet names
- Species (Dog, Cat, Goat, Pig)
- Primary and secondary breeds
- ZIP codes

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Clone the repository or download the files
2. Navigate to the project directory:
   ```bash
   cd seattle-pet-map
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode
```bash
npm start
```
This will start the development server at `http://localhost:3000`

#### Production Build
```bash
npm run build
npx serve -s build -l 3000
```

## Usage

1. **View the Map**: The application loads with all pet licenses displayed on the map
2. **Filter by Species**: Use the filter buttons to show only specific species
3. **Explore ZIP Codes**: Click on circles to see detailed information about pet licenses in that area
4. **Navigate**: Use standard map controls to zoom and pan around Seattle

## Map Legend

- **Red circles**: Dogs
- **Teal circles**: Cats  
- **Blue circles**: Goats
- **Green circles**: Pigs
- **Circle size**: Proportional to the number of licenses

## Statistics

The application displays:
- Number of ZIP codes with data
- Total licenses shown
- Currently selected filter

## ZIP Code Coverage

The application includes coordinate data for major Seattle ZIP codes including:
- Downtown Seattle (98101, 98104, 98121)
- Capitol Hill (98102, 98112)
- Fremont/Wallingford (98103, 98115)
- University District (98105)
- Georgetown/South Park (98108)
- Ballard (98107, 98117)
- And many more...

## Data Processing

The application:
1. Loads CSV data from the public folder
2. Filters out invalid entries
3. Groups data by ZIP code
4. Calculates statistics for each area
5. Maps ZIP codes to geographic coordinates

## Responsive Design

The layout adapts to different screen sizes:
- **Desktop**: Legend, map, and statistics displayed side by side
- **Mobile**: Stacked layout with full-width components

## Browser Support

The application works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Seattle Open Data portal for providing the pet license dataset
- OpenStreetMap contributors for map tiles
- Leaflet community for the mapping library