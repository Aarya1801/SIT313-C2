import viteSetupImage from '../assets/tutorial-vite.svg'
import responsiveGridImage from '../assets/tutorial-grid.svg'
import formsImage from '../assets/tutorial-forms.svg'

const tutorials = [
  {
    id: 1,
    image: viteSetupImage,
    imageAlt: 'Code editor and Vite lightning bolt illustration',
    title: 'Start a React Project with Vite',
    description: 'Set up a fast development environment and understand the essential project files.',
    rating: 4.9,
    author: 'devsam',
  },
  {
    id: 2,
    image: responsiveGridImage,
    imageAlt: 'Responsive card grid illustration',
    title: 'Build a Responsive Card Grid',
    description: 'Create a flexible layout that moves smoothly from desktop to mobile screens.',
    rating: 4.8,
    author: 'pixelpat',
  },
  {
    id: 3,
    image: formsImage,
    imageAlt: 'Email form interface illustration',
    title: 'Handle Simple Forms in React',
    description: 'Respond to form submissions and provide clear feedback using straightforward JSX.',
    rating: 4.7,
    author: 'codewithlee',
  },
]

export default tutorials
