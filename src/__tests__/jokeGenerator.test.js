import React from "React";
import {render , Simulate , wait} from "react-testing-library";
import "dom-testing-library/extend-expect";
import Joke from "../joke.js"
import JokeGenerator from "../jokeGenerator";
import * as axios from "axios"
import MockAxios from "axios-mock-adapter";

const mock = new MockAxios(axios , {delayResponse: Math.random() * 500});

afterAll(() => mock.restore());

test("Joke component receives props and then renders text", () => {

    const { getByTestId } = render(
        <Joke text="the funniest joke this year." />
    );

    expect(getByTestId("joke-text")).toHaveTextContent(
        "The funniest joke this year."
    );
});

test("'JokeGenerator' component fetches a random joke a renders it", () => {

    mock.onGet().replyOnce(200 , {
        value: {
            joke : "Really funny joke!"
        }
    });
    
    const { getByText , queryByTestId , queryByText } = render(<JokeGenerator />);

    //expect(getByText("1.You haven't loaded any joke yet")).toBeInTheDOM();

    Simulate.click(getByText("Load a random joke"));

    expect(queryByText("2.You haven't loaded any joke yet!")).not.toBeInTheDOM();

    expect(queryByText("Loading...")).toBeInTheDOM();

    async() => {
        await wait(() => expect(queryByText("3.You haven't loaded any joke yet!")).not.toBeInTheDOM());
    }

    expect(queryByTestId("joke-text")).not.toBeInTheDOM();
})

