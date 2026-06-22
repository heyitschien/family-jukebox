export function BrandAppIcon() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(145deg, #071015 0%, #111821 46%, #1a0812 100%)",
        color: "#f7fbff",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -56,
          left: -44,
          width: 220,
          height: 220,
          display: "flex",
          borderRadius: 999,
          background: "rgba(255, 111, 177, 0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -64,
          bottom: -48,
          width: 250,
          height: 250,
          display: "flex",
          borderRadius: 999,
          background: "rgba(108, 183, 255, 0.42)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 42,
          top: 48,
          width: 86,
          height: 86,
          display: "flex",
          borderRadius: 999,
          background: "rgba(196, 181, 253, 0.32)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "74%",
          height: "74%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 108,
          border: "8px solid rgba(255, 255, 255, 0.18)",
          background: "linear-gradient(135deg, #ff6fb1 0%, #ff8fc5 44%, #6cb7ff 100%)",
          boxShadow: "0 28px 70px rgba(255, 111, 177, 0.34)",
          color: "#1a0812",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0.88,
            letterSpacing: -12,
            fontSize: 156,
            fontWeight: 900,
          }}
        >
          CR
        </div>
        <div
          style={{
            position: "absolute",
            right: 42,
            bottom: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 999,
            background: "#1a0812",
            color: "#ffb8d9",
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ♪
        </div>
      </div>
    </div>
  );
}
