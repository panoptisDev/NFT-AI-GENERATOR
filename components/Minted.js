export default function Minted(props) {
    return (
        <div className={styles.Minted}>
            <img src={props.img}></img>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
        </div> 
    )
}