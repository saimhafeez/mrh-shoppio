import styled from 'styled-components'

const Wrapper = styled.aside`
    div {
        width: 100%;
    }
    .flex{
        display: flex;
    }
    .center {
        justify-content: center;
    }

    .image {
        display: none;
    }

    .form-container {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: start;
        justify-content: start;
        width: 100%;
    }

    @media (min-width: 992px){
        .image {
            display: block;
        }
    }
`

export default Wrapper