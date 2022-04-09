import {Tuits} from "../components/tuits/index";
import {screen} from "@testing-library/react";
import {render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";


jest.mock('axios');
const MOCKED_TUITS = [
    {tuit: "alice's tuit",postedBy:'alice123', _id:"6201d14ed4a5094d1244cdf0"},
    {tuit: "bob's tuit",postedBy:'bob123',  _id:"6201d14ed4a5094d1244cdf1"},
    {tuit: "charlie's tuit",postedBy:'bob123',  _id:"6201d14ed4a5094d1244cdf2"}
];

// test tuit list renders static tuit array
test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <Tuits tuits={MOCKED_TUITS}/>
      </HashRouter>
  );

  const linkElementA = screen.getByText(/alice's tuit/i);
  const linkElementB = screen.getByText(/bob's tuit/i);
  const linkElementC = screen.getByText(/charlie's tuit/i);
  expect(linkElementA).toBeInTheDocument();
  expect(linkElementB).toBeInTheDocument();
  expect(linkElementC).toBeInTheDocument();
});

//test tuit list renders async
test('tuit list renders async', async () => {
  const tuits = await findAllTuits();
  render(
      <HashRouter>
        <Tuits tuits={tuits}/>
      </HashRouter>
  );
  const linkElement = screen.getByText(/In 2021, our @NASAPersevere/i);
  const linkElementA = screen.getByText(/@SpaceX Dragon spacecraft/i);
  expect(linkElement).toBeInTheDocument()
  expect(linkElementA).toBeInTheDocument()
});

test('tuit list renders mocked', async () => {
    axios.get.mockImplementation(() =>
        Promise.resolve({ data: {tuits: MOCKED_TUITS} }));
    const response = await findAllTuits();
    const tuits = response.tuits;
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    const tuit = screen.getByText(/charlie's tuit/i);
    expect(tuit).toBeInTheDocument();
});;
