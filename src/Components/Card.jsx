import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import im1 from './../Photos/test1.jpg';
import im2 from './../Photos/test1.jpg';
import im3 from './../Photos/test1.jpg';

function GroupExample() {
  return (
    <div className="container my-5 py-4"> {/* Increased margin and padding on upper and lower sides */}
      <CardGroup className="gap-3">
        <Card className="mx-3"> {/* Adds horizontal margin to each card */}
          <Card.Img variant="top" src={im1} />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text className='text-start'>
              This is a wider card with supporting text below as a natural lead-in
              to additional content. This content is a little bit longer.
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
        <Card className="mx-3">
          <Card.Img variant="top" src={im2} />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text className='text-start'>
              This card has supporting text below as a natural lead-in to
              additional content.
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
        <Card className="mx-3">
          <Card.Img variant="top" src={im3} />
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            <Card.Text className='text-start'>
              This is a wider card with supporting text below as a natural lead-in
              to additional content. This card has even longer content than the
              first to show that equal height action.
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
      </CardGroup>
    </div>

    
  );
}

export default GroupExample;
