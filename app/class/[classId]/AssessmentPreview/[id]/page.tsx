
export default function AssessmentPreviewPage({
    params,
  }: {
    params: { classid: string; id: string };
  }) {
    return (
      <div>
        <h1>Class ID: {params.classid}</h1>
        <h2>Assessment ID: {params.id}</h2>
      </div>
    );
  }
  