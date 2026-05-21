const Section = ({ children, style = {}, className = '', maxWidth = 1200, padding = '26px 32px 0' }) => (
  <section className={className} style={{
    maxWidth,
    margin: '0 auto',
    padding,
    ...style,
  }}>
    {children}
  </section>
);

export default Section;
