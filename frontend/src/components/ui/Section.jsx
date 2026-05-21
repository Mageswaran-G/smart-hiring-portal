const Section = ({
  children,
  style = {},
  className = '',
  maxWidth = 1200,
  isMobile = false,
  mobilePadding = '14px 14px 0',
  desktopPadding = '26px 32px 0',
  padding,
}) => (
  <section className={className} style={{
    maxWidth,
    margin: '0 auto',
    padding: padding || (isMobile ? mobilePadding : desktopPadding),
    ...style,
  }}>
    {children}
  </section>
);

export default Section;