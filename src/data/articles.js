import reactPatternsImage from '../assets/article-react-patterns.svg'
import accessibleWebImage from '../assets/article-accessibility.svg'
import cleanCssImage from '../assets/article-css.svg'

const articles = [
  {
    id: 1,
    image: reactPatternsImage,
    imageAlt: 'Abstract React component diagram',
    title: 'Thinking in Reusable React Components',
    description: 'A practical approach to breaking a page into focused, reusable interface pieces.',
    rating: 4.9,
    author: 'Maya Chen',
  },
  {
    id: 2,
    image: accessibleWebImage,
    imageAlt: 'Accessible interface controls illustration',
    title: 'Accessibility Is Part of Good Design',
    description: 'Small choices that make websites clearer and easier for everyone to use.',
    rating: 4.8,
    author: 'Noah Williams',
  },
  {
    id: 3,
    image: cleanCssImage,
    imageAlt: 'Layered CSS layout illustration',
    title: 'Writing CSS That Stays Manageable',
    description: 'Use consistent variables, spacing and selectors to keep growing projects tidy.',
    rating: 4.7,
    author: 'Priya Shah',
  },
]

export default articles
