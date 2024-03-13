import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import Loader from 'react-loaders'
const Contact = () => {
  return (
    <>
      <div className="container contact-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              strArray={['C', 'o', 'n', 't', 'a', 'c', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Contact
