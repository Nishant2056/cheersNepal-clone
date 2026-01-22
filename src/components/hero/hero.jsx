import HeroImg from "../../assets/hero-image.svg";
import css from "./Hero.module.css";

const Hero = () => {
  return (
    <div>
      <center className={`${css.heroPicture}`}>
        <img src={HeroImg} alt="" />
      </center>
    </div>
  );
};

export default Hero;
