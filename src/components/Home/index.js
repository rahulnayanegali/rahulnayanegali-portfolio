import './index.scss'
import { Link } from 'react-router-dom'
import LogoTitle from '../../assets/images/logo-s.png'
import { useEffect, useState } from 'react'
import AnimatedLetters from '../AnimatedLetters'
import Logo from './Logo'
const Home = () => {
  const [letterClass, setletterClass] = useState('text-animate')
  const nameArray = ['u', 'j', 'i', 't', 'h']
  const jobArray = [
    'W',
    'e',
    'b',
    ' ',
    'D',
    'e',
    'v',
    'e',
    'l',
    'o',
    'p',
    'e',
    'r.',
  ]

  useEffect(() => {
    setTimeout(() => {
      setletterClass('text-animate-hover')
      return () => {}
    }, 4000)
  }, [])

  return (
    <div className="container home-page">
      <div className="text-zone">
        <h1>
          <span className={letterClass}>H</span>
          <span className={`${letterClass} _12`}>i,</span>
          <br />
          <span className={`${letterClass} _13`}>I</span>
          <span className={`${letterClass} _14`}>'m</span>
          <img src={LogoTitle} alt="developer" />
          <AnimatedLetters
            letterClass={letterClass}
            strArray={nameArray}
            idx={15}
          />
          <br />
          <AnimatedLetters
            letterClass={letterClass}
            strArray={jobArray}
            idx={15}
          />
        </h1>
        <h2> FrontEnd developer / Javascript Expert </h2>
        <Link className="flat-button" to="/contact">
          CONTACT ME
        </Link>
      </div>
      <Logo />
    </div>
  )
}

export default Home
